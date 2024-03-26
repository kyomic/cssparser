export const params_rules = {
  'margin': [
    ['margin-top/margin-right/margin-bottom/margin-left'],
    ['margin-top/margin-bottom', 'margin-left/margin-right'],
    ['margin-top', 'margin-left/margin-right','margin-bottom'],
    ['margin-top','margin-right','margin-bottom','margin-left'],
  ],
  'padding': [
    ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
  ],
  'border': [
    ['border-width'],
    ['border-width', 'border-color'],
    ['border-width', 'border-style', 'border-color']
  ]
}
