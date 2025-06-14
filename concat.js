var concat = require('concat-files');
concat([
    './dist/calendar-component/browser/polyfills.js',
    './dist/calendar-component/browser/main.js'
], './dist/calendar-component/browser/script.js', function(err) {
    if (err) throw err
    console.log('done');
});