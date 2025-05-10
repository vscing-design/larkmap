// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  rules: [
    // 自定义规则生成类
    [/^letter-spacing-(\d+(?:\.\d+)?)(?:-([a-zA-Z%]+))?$/, 
      ([, value, unit]) => ({ 
        'letter-spacing': `${value}${unit || (value != "0" ? 'rem' : '')}`
      })
    ], 
    // 模糊效果
    [
      /^(vscing-backdrop-filter-blur)-(\d+)$/,
      ([, , value]) => ({
        'backdrop-filter': `blur(${value}px)`,
        // 默认半透明背景
        background: 'rgba(255, 255, 255, 0.8)',
      }),
    ],
    // 亮度调整
    [
      /^(vscing-backdrop-filter-brightness)-(\d+)$/,
      ([, , value]) => ({ 'backdrop-filter': `brightness(${value}%)` }),
    ],

    // 主题颜色
    ['vbg-color-main', { 'background-color': 'var(--background-color-main)' }],
    ['vbg-color-footer', { 'background-color': 'var(--background-color-footer)' }],
    ['vbg-color-card', { 'background-color': 'var(--background-color-card)' }],
    ['vbg-color-subCard', { 'background-color': 'var(--background-color-subCard)' }],
    ['vbg-color-button', { 'background-color': 'var(--background-color-button)' }],
    ['vbg-color-drag', { 'background-color': 'var(--background-color-drag)' }],

    ['vborder-color-default', { 'border-color': 'var(--border-color-default)' }],
    ['vborder-color-active', { 'border-color': 'var(--border-color-active)' }],
    ['vborder-color-drag', { 'border-color': 'var(--border-color-drag)' }],

    ['vcolor-title', { color: 'var(--font-color-title)' }],
    ['vcolor-subTitle', { color: 'var(--font-color-subTitle)' }],
    ['vcolor-default', { color: 'var(--font-color-default)' }],
    ['vcolor-desc', { color: 'var(--font-color-desc)' }],
    ['vcolor-icon', { color: 'var(--font-color-icon)' }],
    ['vcolor-error', { color: 'var(--font-color-error)' }],
    ['vcolor-success', { color: 'var(--font-color-success)' }],
    ['vcolor-dark', { color: 'var(--font-color-dark)' }],

    ['vmask-color-main', { 'background-color': 'var(--mask-color-main)' }],

    ['vgradient-color-main', { 'background': 'var(--gradient-color-main)' }],
    ['vgradient-color-card', { 'background': 'var(--gradient-color-card)' }],

    // 阴影
    ['vshadow-color-layout', { 'box-shadow': 'var(--shadow-color-layout)' }],
    ['vshadow-color-mask', { 'box-shadow': 'var(--shadow-color-mask)' }],
  ],
  shortcuts: {
    // moveSelect
    'move-select': 'vbg-color-drag! vborder-color-drag!',
    // leftIcon
    'left-icon-item': 'flex items-center justify-center border border-solid! vborder-color-default vcolor-icon w-36px h-36px b-rounded-6px',
    // modeList
    'model-list-item': 'flex flex-col items-center justify-center border border-solid vborder-color-default w-236px h-92px b-rounded-8px cursor-pointer',
    // formItem
    'form-item': 'flex flex-col items-start justify-center w-full',
    'form-item-title': 'vcolor-title font-500 text-14px line-height-24px m-b12px',
    'form-item-input': 'outline-none box-border border border-solid vbg-color-main vcolor-title vborder-color-default w-100% font-400 text-14px line-height-24px px-16px py-8px b-rounded-8px',
    'form-item-input-error': 'vcolor-error font-400 mt-4px text-13px line-height-20px',
    'form-item-upload': 'position-relative flex flex-col items-center justify-center vbg-color-main w-360px h-120px border border-dashed vborder-color-default b-rounded-8px cursor-pointer',
  }
})
