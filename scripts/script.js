const checks = ['#count_apostrophes_check', '#count_hyphens_check', '#no_spaces_check']
const size_options = [40, 25, 15]
let size_counter = 1
let reload_time = 5000
const ls = localStorage
const cs = console
function initialize() {
  if (ls.getItem('textcache') === null) {
    cs.warn("Failed to load localStorage variables, using deafults")
  }
  else if (ls.getItem('textcache') !== '') {
    cs.groupCollapsed("%cCached text", "font-weight: normal")
    cs.log(ls.getItem('textcache'))
    cs.groupEnd()
  }
  else {
    console.log('Cached text: %cnone', 'color: cyan')
  }
  cs.groupCollapsed("%cCached checks", "font-weight: normal")
  cs.table([+ls.getItem(checks[0]), +ls.getItem(checks[1]), +ls.getItem(checks[2])])
  cs.groupEnd()
  cs.log(`Save rate: %c${reload_time}ms`, 'color: cyan')
  if (ls.getItem('darkmode') == null) {
    $('#change-theme').prop('checked', +window.matchMedia('(prefers-color-scheme: dark)').matches)
    cs.log(`Dark mode: %c${+ls.getItem('darkmode')} %c(system deafult)`, 'color: cyan', 'color: white')
  }
  else {
    $('#change-theme').prop('checked', parseInt(ls.getItem('darkmode')))
    cs.log(`Dark mode: %c${+ls.getItem('darkmode')}`, 'color: cyan')
  }
  changeTheme()
  $('#txt').val(ls.getItem('textcache'))
  for (const check_name of checks) {
    $(check_name).prop('checked', parseInt(ls.getItem(check_name)))
  }
}
function cache() {
  ls.setItem('textcache', $('#txt').val())
  for (const check_name of checks) {
    ls.setItem(check_name, +$(check_name).is(':checked'))
  }
  ls.setItem('darkmode', +$('#change-theme').is(':checked'))
}
function count() {
  const count_apostrophes = $(checks[0]).is(':checked')
  const count_hyphens = $(checks[1]).is(':checked')
  const no_spaces = $(checks[2]).is(':checked')
  let [word_count, char_count] = [0, 0]
  for (const element of $('#txt').val().split(/[\s\n]+/)) {
    if (element != '-' && element != ' ') {
      if (count_hyphens && element.includes('-')) {
        word_count += element.split('-').length
      }
      else {
        if (element != '') {
          word_count += 1
        }
      }
      if (count_apostrophes && element.includes("'")) {
        word_count += 1
      }
    }
  }
  if (no_spaces) {
    for (const character of $('#txt').val()) {
      if (character != ' ') {
        char_count += 1
      }
    }
  }
  else {
    char_count = $('#txt').val().length
  }
  let string = ' words, '
  if (count == 1) {
    string = ' word, '
  }
  $('#wordcount').html(word_count + string + char_count + ' characters')
  ls.setItem('textcache', $('#txt').val())
}
function changeTheme() {
  if ($('#change-theme').is(':checked')) {
    $('#style').attr("href", "assets/dark.css")
  }
  else {
    $('#style').attr("href", "assets/light.css")
  }
  ls.setItem('darkmode', +$('#change-theme').is(':checked'))
}
function resize() {
  if ($('#resize').is(':checked')) {
    $('#txt').css({'width': '95%', 'height': '95%'})
  }
  else {
    $('#txt').css({'width': '55%', 'height': '40%'})
  }
}
function sizeSetting() {
 size_counter++
 if (size_counter > 2) {
   size_counter = 0
 }
 $('#txt').css({'font-size': `${size_options[size_counter]}px`})
 $('#size-setting').html(`${size_options[size_counter]}px`)
}
window.setInterval(cache, reload_time)
