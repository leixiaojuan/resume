/***
 * 分析问题：
 * 1，随机生成小绿球在顶部 随机的位置
 * 2，自己带运动
 * 3，弹性运动 
 * 4，生成多个小绿球
 * 5，小红球的拖拽  有边界  
 * 6，小红求 和 小绿球 之间碰撞检测
 * 7，定清楚 
 * （单对象的编程）
 */

var game = {
    name: '游戏立即开始',
    redBall: document.getElementsByClassName('red')[0],
    numRun:document.getElementsByTagName('span')[0],
    greenArr: [],
    num:0,
    flage: true,
    movePlus: {
        outer: document.getElementsByClassName('outer')[0], //舞台
        iWidth: document.getElementsByClassName('outer')[0].offsetWidth, //舞台的宽
        iHeight: document.getElementsByClassName('outer')[0].offsetHeight, //舞台的高
        ispeedY: 10, //小绿球的速度y
        ispeedX: 10 //小绿球的速度x
    },

    init: function () {
        console.log(this.name);
        this.creatBall(this.movePlus); //创建小绿球 
        this.dragRegBall(this.movePlus); //小红球的拖拽
        this.timerRun();//开始计时

    },
    timerRun:function(){
        var self   =  this;//game
        this.timer = setInterval(function(){
            self.num++;
            // this指向的window 
            self.numRun.innerHTML = '坚持了' + self.num + "秒！"
        }, 1000);


    },
    creatBall: function (obj) {
        var plus = obj;
        var self = this;
        function Green(plus) { //构造函数 小绿球的构造函数
            this.ball = document.createElement('div'); //创建dom（div）
            this.ball.className = 'green'; //赋予类名
            plus.outer.appendChild(this.ball); //小绿球放到舞台上
            this.subWidth = Math.floor(Math.random() * (plus.iWidth - this.ball.offsetWidth));
            this.ball.style.left = this.subWidth + 'px'; //随机的位置
            this.speedX = Math.floor(Math.random() * plus.ispeedX) + 1; //小球随机的x速度
            this.speedY = Math.floor(Math.random() * plus.ispeedY) + 1; //小球随机的y的速度
            this.iWidth = plus.iWidth;
            this.iHeight = plus.iHeight

        }


        var green = new Green(plus);
        this.greenArr.push(green);//创建小球对象 放到数组里 

        this.creatTimer = setInterval(function(){
            var green = new Green(plus);
            self.greenArr.push(green)
        }, 2000);
        this.moveBall(); //小球运动函数




    },
    moveBall: function () {
        var self = this;
        //创建定时器 
        this.goTimer = setInterval(function () {

            for (var i = 0; i < self.greenArr.length; i++) {
                self.crashCheck(self.greenArr[i]);//碰撞检测
                var newLeft = self.greenArr[i].ball.offsetLeft + self.greenArr[i].speedX;
                var newTop = self.greenArr[i].ball.offsetTop + self.greenArr[i].speedY;

                //弹性运动
                if (newLeft < 0) {
                    self.greenArr[i].speedX *= -1;
                } else if (newLeft > (self.greenArr[i].iWidth - self.greenArr[i].ball.offsetWidth)) {

                    self.greenArr[i].speedX *= -1;

                } else if (newTop < 0) {

                    self.greenArr[i].speedY *= -1;

                } else if (newTop > (self.greenArr[i].iHeight - self.greenArr[i].ball.offsetHeight)) {

                    self.greenArr[i].speedY *= -1;


                }



                self.greenArr[i].ball.style.left = newLeft + 'px';
                self.greenArr[i].ball.style.top = newTop + 'px';

            }



        }, 50)

    },
    dragRegBall: function (obj) {
        var self = this;
        this.redBall.onmousedown = function (e) {
            var e_x = e.pageX;
            var e_y = e.pageY;

            document.onmousemove = function (e) {

                var chax = e.pageX - e_x;
                var chay = e.pageY - e_y;
                self.redBall.style.left = chax + self.redBall.offsetLeft + 'px';
                self.redBall.style.top = chay + self.redBall.offsetTop + 'px';
                e_x = e.pageX; //更新上一个点 ，永远会产生差值
                e_y = e.pageY;

                //判断边界
                if (self.redBall.offsetLeft < 0 && self.flage) {
                    alert('游戏结束！')
                    self.flage = false;
                    self.clearTimer();
                    window.location.reload(); //刷新页面 游戏重开
                } else if (self.redBall.offsetLeft > (obj.iWidth - self.redBall.offsetWidth) && self.flage) {

                    alert('游戏结束！')
                    self.flage = false;
                    self.clearTimer();
                    window.location.reload(); //刷新页面 游戏重开

                } else if (self.redBall.offsetTop < 0 && self.flage) {
                    alert('游戏结束！')
                    self.flage = false;
                    self.clearTimer();
                    window.location.reload(); //刷新页面 游戏重开
                } else if (self.redBall.offsetTop > (obj.iHeight - self.redBall.offsetHeight) && self.flage) {
                    alert('游戏结束！')
                    self.clearTimer();
                    self.flage = false;
                    window.location.reload(); //刷新页面 游戏重开
                }



            }

            this.onmouseup = function (e) {
                document.onmousemove = null;
            }






        }



    },
    crashCheck: function (green) {

        // this.redBall
        //小绿球的圆心点
        var greenX1 = green.ball.offsetLeft + Math.floor(green.ball.offsetWidth / 2);
        var greenY1 = green.ball.offsetTop + Math.floor(green.ball.offsetHeight / 2);

        //小红球的圆心
        var redX2 = this.redBall.offsetLeft + Math.floor(this.redBall.offsetWidth / 2);
        var redY2 = this.redBall.offsetTop + Math.floor(this.redBall.offsetHeight / 2);
        // x1-x2  y1-y2 绝对值
        var dx = Math.abs(greenX1 - redX2);
        var dy = Math.abs(greenY1 - redY2);

        //两点间就离
        var dis = Math.floor(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
        console.log(dis);
        var R = this.redBall.offsetWidth / 2 + green.ball.offsetWidth / 2;

        if (dis < R && this.flage) {
            
            alert('游戏结束！')
            this.flage = false;
            this.clearTimer();
            window.location.reload(); //刷新页面 游戏重开

        }








    },
    clearTimer:function(){
        //this对象上面有多少个定时器
        clearInterval(this.goTimer);
        clearInterval(this.creatTimer);
        clearInterval(this.timer);
    }


}
game.init(); //入口函数