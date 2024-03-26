
import { params_rules } from './core/CSSRule'

let css_rules: any = params_rules
let css_mapping: any = {}
for (let i in css_rules) {
  css_mapping[i] = i;
  const arr = (css_rules[i] || []).flat()
  for (let j = 0; j < arr.length; j++) {
    const keys = arr[j].split('/');
    keys.map((k: string) => {
      css_mapping[k] = k
    })
  }
}
//console.log('cssMapping', css_mapping, params_rules)
export type ParserOption = {
  mergeGroup: boolean,
  mergeCSS?: boolean
}

export type CSSInfo = Array<{ name: string, css: Array<{ name: string, value: string }>, mapping: Record<string, string> }>



export class CSSParser {
  /**
 * name：CSS分组名
 * css: CSS样式集
 * mapping:CSS混合后的缓存（多个CSS样式集去重后的样式数据，如border, border-color的颜色会进行合并)
 */
  private _cssInfo: CSSInfo = []
  private _option: ParserOption = { mergeGroup: true, mergeCSS: false }
  constructor() { }

  private mergeCSS(arr: Array<{ name: string, value: string }>) {
    let cache: any = {}
    let css_mapping_rules: any = params_rules
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const name = arr[i].name
      const value = arr[i].value;
      if (css_mapping[name]) {
        const arr = value.split(/[ ]+/);
        if (css_mapping_rules[name]) {
          const map = css_mapping_rules[name][arr.length - 1];
          if (!map) {
            console.warn(`解析CSS出现问题：名为：${name}，值为:${value}未配置map`)
          } else {
            arr.map((item, index) => {
              const mapkeys = map[index].split('/')
              mapkeys.map((k: string) => {
                cache[k] = arr[index]
              })
            })
          }
        } else {
          cache[name] = value
        }
      }
    }
    return cache;
  }
  /**
 * 将字符串解释为数组格式
 * @param {string} str - css文本字符串，如以: .a{ .. } 形式封装
 * @param option 
 */
  private makeArray(str: string) {
    const regexp_block = /([^\{]+){([^\}]+)}/ig;
    const regexp_line = /([a-z\-]+)\s*\:\s*(([\w -]+)|([\w\s-]+\([^\)]+\)\s*\.*))[;?|\n|$]/ig;
    let matched = null;
    let groupMapping: any = {}
    let group = null;
    let result = [];
    while (true) {
      matched = regexp_block.exec(str);
      if (!matched) {
        break;
      }
      const key = matched[1].replace(/\s{2,}/ig, '').replace(/\n/ig, '')
      if (this._option.mergeGroup) {
        if (!groupMapping[key]) {
          group = {
            name: key,
            css: []
          };
          result.push(group)
          groupMapping[key] = group;
        } else {
          group = groupMapping[key]
        }
      } else {
        group = {
          name: key,
          css: []
        };
        result.push(group)
      }
      const css = matched[2];
      let cssline = null;
      let lines = group.css || [];
      while (true) {
        cssline = regexp_line.exec(css);
        if (!cssline) {
          break;
        }
        lines.push({
          name: cssline[1],
          value: cssline[2]
        })
        //console.log('cssline', cssline)
      }
    }
    return result;
  }
  /**
   * 解析CSS文本
   * @param str 
   * @param option 
   */
  parse = (str: string, option: ParserOption = { mergeGroup: true }): CSSInfo => {
    this._option = option
    this._cssInfo = this.makeArray(str).map((item, index) => {
      return {
        ...item, mapping: this.mergeCSS(item.css)
      }
    })
    return this._cssInfo;
  }

  /**
   * 更新样式集
   * @param name 
   * @param value 
   * @param path 
   */
  set(name: string, value: string, path: string = ':root') {
    let info = this._cssInfo.find(item => item.name == path);
    if (!info) {
      info = {
        name: path,
        css: [{
          name, value
        }],
        mapping: {}
      }
      this._cssInfo.push(info)
    } else {
      (info.css || []).map(item => {
        if (item.name == name) {
          item.value = value;
        }
        return item;
      })
    }
  }

  /**
   * 返回样式值
   * @param name 
   * @param path 
   */
  get(name: string, path: string = ':root') {
    let info = this._cssInfo.find(item => item.name == path);
    if (info) {
      const mapping = info.mapping;
      const css = info.css;
      if( mapping[name]){
        return mapping[name];
      }else{
        return css.find( item=> item.name == name )?.value ?? ''
      }
    }
    return ''
  }

  clear() {
    this._cssInfo = []
  }

  /**
   * 全并CSS信息
   */
  mergeCSSInfo() {
    let css_mapping_rules: any = params_rules
    return (JSON.parse(JSON.stringify(this._cssInfo)) as CSSInfo).map(item => {
      let css = item.css || [];
      let mapping = item.mapping
      let mergeInfo: any = {}
      for (let i of css) {
        if (css_mapping_rules[i.name]) {
          const css_key = i.name;
          mergeInfo[css_key] = {}
          mergeInfo[css_key][i.name] = i.name;
          let arr = css_mapping_rules[i.name]
          let findLevel = -1;
          let someLevel = -1;
          for (let j = arr.length - 1; j > -1; j--) {
            let tmp: any = {}
            if (arr[j].every((item: any) => {
              let keys = item.split('/');
              if (keys.every((key: string) => {
                let every = !!mapping[key]
                if (every) {
                  someLevel = j;
                }
                if (every) {
                  tmp[key] = mapping[key]
                }
                return every;
              })) {
                return true;
              }
              return false;
            })) {
              for (let i in tmp) {
                mergeInfo[css_key][i] = tmp[i]
              }
              findLevel = j;
              break;
            }
          }
          if (findLevel >= arr.length - 1 || findLevel > -1 && findLevel == someLevel) {
            //console.log('可以合屏', mergeInfo)
            mergeInfo['level'] = { value: findLevel }
          } else {
            mergeInfo = {}
          }
          //console.log('find Level', findLevel, 'someLevel', someLevel, i.name)
        }
      }
      css = css.filter(item => {
        let has = false;
        for (let i in mergeInfo) {
          if (item.name in mergeInfo[i]) {
            has = true;
            break;
          }
        }
        return !has;
      })
      for (let i in mergeInfo) {
        if (i != 'level') {
          let level = mergeInfo.level.value;
          let keys = css_mapping_rules[i][level];
          css.push({
            name: i,
            value: keys.map((item: any) => {
              return mergeInfo[i][item]
            }).join(' ')
          })
        }

      }
      item.css = css;
      return item;
    })
  }
  /**
   * 原始CSS数据
   */
  get css() {
    return this._cssInfo
  }

  /**
   * 将CSS数据转为文本格式
   */
  get cssText() {
    const infos = this._option.mergeCSS ? this.mergeCSSInfo() : this._cssInfo
    const res: string[] = []
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i]
      const css = info.css;
      res.push(`${info.name}{`)
      css.map(item => {
        res.push(`    ${item.name}:${item.value};`)
      })
      res.push(`}`)
    }
    return res.join('\n')
  }
}
