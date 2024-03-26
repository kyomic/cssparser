import { CSSParser } from '../src/index';

test('adds 1 + 2 to equal 3', () => {
  let code = `
    :root{
      background:red;
    }
  `
  const instance = new CSSParser()
  instance.parse(code)
  const obj = instance.css
  expect(obj).toHaveProperty('background');





  code = `:root{
  color:blue;font:red;
  background-image: url('data:image/png;base64,iVBOR');
  border:1px
  border-color:red;
  
}


:root abc{
  border:1px solid red;
}

`

  const p = new CSSParser()
  let info = p.parse(code)
  //p.clear()

  p.set('color', 'red')

  info = p.css
  console.log('info', JSON.stringify(info, null, 2))

  console.log('text')
  console.log(p.cssText)
  console.log(p.get('border-color'))

});
