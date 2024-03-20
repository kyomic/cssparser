# h1 标题
## CSSParser
一个简单的CSS解析器，可以将文本CSS转义为对象格式，并组支持合并简写样式。

## 使用场景
低代码设计器CSS解析模块（动态调整组件样式）

## 使用示例

```javascript
npm install lc-cssparser

import CSSParser from 'lc-cssparser';
const instance = new CSSParser();
const code = `
    :root{
      background:red;
    }
	
	:root abc{
		color:red;
	}
  `
instance.parse(code).css
// output: [{ name:':root',css:[{name:'background',value:'red'}]}, {name:':root abc',css:[{name:'color',value:'red'}]}]

```

## 更多API

### 参数：new CSSParser(opt:ParserOption )

| 参数 | 类型 | 名称 | 是否必填 | 默认值 |
| - | - | - | - | - |
| mergeGroup | Boolean | 是否合并多条CSS组 | 否 | 是 |
| mergeCSS | Boolean | 是否合并简写样式条目，如：border:1px, border-width:1px | 否 | 否 |

### 方法： 
#### parse(text)
解析CSS文本

#### clear()
清除CSS数据

#### set(name,value)
设置一条样式属性

#### get(name)
查指一条样式值

### 属性：
#### css
返回文本CSS的对象数据

#### cssText
返回文本CSS的对象字符串表示
