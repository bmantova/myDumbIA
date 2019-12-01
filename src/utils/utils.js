export default {
  randint: (a, b) => {
    return Math.floor(Math.random() * (b - a) + a)
  },
  randfloat: (a, b) => {
    return Math.random() * (b - a) + a
  },
  limit: (v, a, b) => {
    if (v < a) return a
    if (v > b) return b
    return v
  },
  debug: (name, value = '') => {
    const className = name.replace(' ', '_')
    if (document.getElementById('debug').getElementsByClassName(className).length > 0) {
      document.getElementById('debug').getElementsByClassName(className)[0].innerHTML = '<span class="res_title">' + name + '</span><span class="res_content">' + value + '</span>'
    } else {
      document.getElementById('debug').innerHTML += '<div class="' + className + '"><span class="res_title">' + name + '</span><span class="res_content">' + value + '</span></div>'
    }
  },
  mousewin: (name, content, x = 0, y = 0) => {
    const mw = document.getElementById('mousewin')
    if (name === 'close') {
      mw.style.display = 'none'
    } else {
      mw.style.display = 'block'
      mw.style.left = (x + 10) + 'px'
      mw.style.top = y + 'px'
      mw.innerHTML = '<div class="title">' + name + '</div>' + content
    }
  },
  virg: (v, e = 1) => {
    const mult = Math.pow(10, e)
    return Math.round(v * mult) / mult
  }
}
