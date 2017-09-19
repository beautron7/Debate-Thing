export default {

  plugins: [
    'textcolor colorpicker',
  ],
  menu: {},
  toolbar1: 'undo redo | fontsizeselect | bold italic underline |  forecolor backcolor | removeformat',
  image_advtab: true,
  branding:false,
  height: 10,
  elementpath:false,
  theme: 'modern',
  formats: {
    // alignleft: {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'left'},
    // aligncenter: {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'center'},
    // alignright: {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'right'},
    // alignjustify: {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'full'},
    bold: {inline : 'span', 'classes' : 'bold', styles: {fontWeight:"bold"}},
    // italic: {inline : 'span', 'classes' : 'italic'},
    underline: {inline : 'span', 'classes' : 'underline', styles:{textDecoration:"underline"}, exact : true},
    // strikethrough: {inline : 'del'},
    forecolor: {inline : 'span', classes : 'forecolor-%value', styles : {color : '%value'}},
    hilitecolor: {inline : 'span', classes : 'hilite-%value', styles : {backgroundColor : '%value'}},
    // custom_format: {block : 'h1', attributes : {title : 'Header'}, styles : {color : 'red'}}
  },
  toolbar1: 'undo redo | fontsizeselect | bold italic underline |  forecolor backcolor | removeformat',
}
