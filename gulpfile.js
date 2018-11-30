const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const webfontsGenerator = promisify(require('webfonts-generator'))
const screenshotTask = require('./gulp/screenshot-task')
const componentSizeFootprint = require('./gulp/component-size-footprint')

require('handlebars-helpers')();

const paths = {
  static_src: 'src/assets/icon/static/*.svg',
  animated_src: 'src/assets/icon/animated/*.svg',
  dest: 'src/assets/fonts/',
  css_dest: 'src/webfonts/',
  html_dest: 'docs/partials/',
  cssTemplateAnimated: 'src/assets/glyph-template-animated.css.hbs',
  cssTemplateStatic: 'src/assets/glyph-template-animated.css.hbs',
  static_html_template: 'src/assets/htmlTemplate-static.hbs',
  animated_html_template: 'src/assets/htmlTemplate-animated.hbs'
}

/**
 * This tasks generates static icons webfonts
 */
gulp.task('static-icons-webfonts', async done => {
  try {
    return webfontsGenerator({
      files: await glob(getAbsPath(paths.static_src)),
      dest: paths.dest,
      fontName: "static-icons",
      templateOptions: {
        classPrefix: 'tri-',
        baseSelector: '.tri',
        src: "url('./assets/fonts/static-icons.woff2') format('woff2'), url('./assets/fonts/static-icons.woff') format('woff')"
      },
      cssTemplate: getAbsPath(paths.cssTemplateStatic),
      cssDest: path.join(paths.css_dest, `static-icons.scss`),
      html: true,
      htmlDest: path.join(paths.html_dest, `static-icons.hbs`),
      htmlTemplate: getAbsPath(paths.static_html_template),
      types: ['woff2', 'woff'],
      order: ['woff2', 'woff']
    })
  } catch (err) {
    gutil.log('Could not generate webfonts', err)
  }
})

/**
 * This task generates animated icons webfonts
 */
gulp.task('animated-icons-webfonts', async done => {
  try {
    return webfontsGenerator({
      files: await glob(getAbsPath(paths.animated_src)),
      dest: paths.dest,
      fontName: "animated-icons",
      templateOptions: {
        classPrefix: 'tri-',
        baseSelector: '.tri',
        extraClass: 'tri-animated',
        src: "url('./assets/fonts/animated-icons.woff2') format('woff2'), url('./assets/fonts/animated-icons.woff') format('woff')"
      },
      cssTemplate: getAbsPath(paths.cssTemplateAnimated),
      cssDest: path.join(paths.css_dest, `animated-icons.scss`),
      html: true,
      htmlDest: path.join(paths.html_dest, `animated-icons.hbs`),
      htmlTemplate: getAbsPath(paths.animated_html_template),
      types: ['woff2', 'woff'],
      order: ['woff2', 'woff']
    })
  } catch (err) {
    gutil.log('Could not generate webfonts', err)
  }
})

/**
 * This tasks generates all icon webfonts
 */
gulp.task("webfonts", ["static-icons-webfonts", "animated-icons-webfonts"])

/**
 * This task takes pictures of all demo templates
 */
gulp.task('docs-template-previews', () => {
  screenshotTask({
    dest: "docs/templates/previews/"
  })
})

gulp.task('components-size-footprint', () => {
  componentSizeFootprint()
})

// Helpers
function getAbsPath(relativePath) {
  return path.join(process.cwd(), relativePath)
}

