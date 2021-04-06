// 1. 页面加载完成之后获取Dom元素
// document.getElementById 得到的是单个元素
// document.getElementByClassName得到的是数组
window.onload = function() {
  var box = document.getElementById('box')
  var carousel = document.getElementById('carousel')
  var buttons = document.getElementById('buttons').getElementsByTagName('span')
  var left = document.getElementById('left')
  var right = document.getElementById('right')
  var index = 1 // 位置
  var animated = false //节流操作，动画在运行点击无效
  var timer //设置定时器

  //2. 设置移动函数animate，绑定左右点击事件
  function animate(offset) {
    //节流操作
    animated = true
    var newPlace = parseInt(carousel.style.left) + offset

    // 6.图片切换动画
    var time = 400 // 一张图片位置总时间
    var interval = 10 // 每次位置切换间隔时间
    var perMoveWidth = offset / (time/interval) // 每次切换单位距离
    function go() {
      // speed<0 向右移动，且newPlace在起始点右侧
      // speed>0 向左移动，且newPlace在起始点左侧时，进行移动
      if( (perMoveWidth < 0 && newPlace < parseInt(carousel.style.left)) || 
          (perMoveWidth > 0 && newPlace > parseInt(carousel.style.left)) ) {
        carousel.style.left = parseInt(carousel.style.left) + perMoveWidth + 'px'
        setTimeout(go, interval)
      }else {
        // 将3移动至go中
        // 达到了newPlace位置时候，判断更新位置
        // 如果移动到了1和7两张附属图，移动到正确的2，6位置
        animated = false
        carousel.style.left = newPlace + 'px'
        if(newPlace > -250) {
          carousel.style.left = -1250 + 'px'
        }
        if(newPlace < -1250) {
          carousel.style.left = -250 + 'px'
        }
      }
    }
    go()

    //  3.无限滚动当超过-250 或者 小于-1250px进行归位
    // carousel.style.left = newPlace + 'px'
    // if(newPlace > -250) {
    //   carousel.style.left = -1250 + 'px'
    // }
    // if(newPlace < -1250) {
    //   carousel.style.left = -250 + 'px'
    // }
  }

  // 7.自动切换动画
  function play() {
    timer = setInterval(() => {
      right.onclick()
    }, 3000)
  }
  function stop() {
    clearInterval(timer)
  }

  //左右点击函数
  right.onclick = function() {
    // 节流操作,当正在执行时，取消操作
    if(animated) {
      return 
    }
    if(index == 5) {
      index = 1
    }else {
      index ++
    }
    shiftButton()
    animate(-250)
  
  }
  left.onclick = function() {
    if(animated) {
      return 
    }
    if(index == 1) {
      index = 5
    }else {
      index --
    }
    shiftButton()
    // 节流操作
    animate(250)
  }

   // 4.圆点切换颜色
   function shiftButton () {
    // 清除之前的圆点样式
    for(var i = 0; i < buttons.length; i++) {
      if(buttons[i].className == 'on') {
        buttons[i].className = ''
        break
      }
    }
    // 切换所选圆点
    buttons[index - 1].className = 'on'
  }
  // 5.圆点点击事件绑定
  // getAttribute() 方法返回指定属性名的属性值
  // getAttributeNode返回属性
  for(var i = 0; i < buttons.length; i++) {
    if(animated) {
      return
    }
    buttons[i].onclick = function() {
      if(this.className == 'on') {
        return 
      }
      var newIndex = parseInt(this.getAttribute('index'))
      var offset = -250 * (newIndex - index)
      index = newIndex
      shiftButton()
      // 节流操作
      animate(offset)
    }
  }
  // 鼠标移动和移出
  box.onmouseover = stop
  box.onmouseout = play
  play()
}
