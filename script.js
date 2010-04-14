window.addEvent('domready', function(){

    if(Browser.Engine.gecko){
        $$('div#loading')[0].setStyle('display', 'none');
    } else {
        $$('div#loading')[0].innerHTML = '<p>REALLY? <br/>Are you this much stupid to do not use Firefox?<br/><br/>Please <a href="http://getfirefox.com/">get firefox</a>.<br/><br/><small>Take it easy! I do not use it too! but you must use it to play! because it is the most JavaScript friendly browser out there!</small></p>';
    }

    var level = 1;

    var right = $$('div#right')[0];
    right.setStyle('background-image', 'url(groom.png)');
    right.point = 0;
    right.scoreboard = $$('div#right-point')[0];
    right.y = right.getStyle('top').toInt();
    right.x = right.getStyle('left').toInt();

    var left = $$('div#left')[0];
    left.setStyle('background-image', 'url(bride.png)');
    left.point = 0;
    left.scoreboard = $$('div#left-point')[0];
    left.y = left.getStyle('top').toInt();
    left.x = left.getStyle('left').toInt();

    // movement of humans!
    var step    = 5;

    // dimensions of the stage
    var height  = 390;
    var width   = 515;

    // scoreboard
    var o_point = 0;
    var l_point = 0;
    var max_point = 3;
    var win = false;

    var started = false;

    // AI
    var human = right;
    var robot = left;
    var who_you_are = 'groom';

    var ad = 'Znfuunq';

    // key down event! (up and down arrow keys!)
    document.addEvent('keypress', function(event){

        if (event.key == "up"){
            if(human.y > 0){
                human.setStyle('top', human.y - step);
                human.y = human.getStyle('top').toInt();
            }

            move(human, 'h', 'groom');
        }
        if (event.key == "down"){
            if(human.y < height - 90 /* height of guys */){
                human.setStyle('top', human.y + step);
                human.y = human.getStyle('top').toInt();
            }

            move(human, 'h', 'groom');
        }

        // character chooser events!
        if ((event.key == "l" || event.key == "L") && level == 3){
            set_characters('bride');
        }

        if ((event.key == "o" || event.key == "O") && level == 3){
            set_characters('groom');
        }

        // move through pages and set levels!
        if (event.key == "space" || event.key == "p"){
            switch(level){
                case 1:
                    $$('div#first')[0].setStyle('display', 'none');
                    level = 2;
                    break;
                case 2:
                    $$('div#second')[0].setStyle('display', 'none');
                    level = 3;
                    break;
                case 3:
                    break;
                case 4:
                    if(!started){
                        started = true;
                        move_ball.delay(500, ball);
                    }
                    break;
                case 5:
                    if(win){
                        $$('div#fifth')[0].setStyle('display', 'none');
                        $$('div#sixth')[0].setStyle('display', 'table');
                        $$('div#sixth')[0].innerHTML = '<p><small>' + ad.rot13() + '</small></p>';
                    } else {
                        window.location.reload();
                    }
                    level = 6;
                    break;
                case 6:
                    break;
            }
        }
    });

    // ball section
    var ball = $$('div#ball')[0];
    ball.speed = 3;
    ball.time = 0;
    ball.angle = 30;
    ball.x = ball.getStyle('left').toInt();
    ball.y = ball.getStyle('top').toInt();
    ball.direction = 1; // 1 mean right, -1 means left

    var move_ball = function(){

        var go_next = true;

        // speed up ball movement
        if(!(this.time % 30)){
            this.speed = this.speed * 1.15;
        }
        this.time++;

        // convert angle to its decimal!
        this.new_angle = this.angle * 3.1415 / 180;

        this.x += this.direction * 5;
        this.y = Math.tan(this.new_angle) * (this.direction * 5) + this.y;

        // move robot character!
        if (this.y < robot.y){
            if(robot.y > 0){
                robot.setStyle('top', robot.y - step);
                robot.y = robot.getStyle('top').toInt();
            }

            move(robot, 'r', 'bride');
        } else {
            if(robot.y < height - 90 /* height of guys */){
                robot.setStyle('top', robot.y + step);
                robot.y = robot.getStyle('top').toInt();
            }

            move(robot, 'r', 'bride');
        }

        // if ball is left
        if(this.x < 55 /* left guy width */) {

            // if ball hit the left guy!
            if(this.y >= left.y - 10 && this.y <= left.y + 110){
                this.angle = (90 - this.angle)  + 90;
                this.direction = 1;

                // make some angles for left guy!
                if(this.y <= left.y + 22){
                    this.angle -= 20;
                } else if(this.y <= left.y + 44){
                    this.angle -= 10;
                } else if(this.y <= left.y + 66){
                // do nothing
                } else if(this.y <= left.y + 88){
                    this.angle += 10;
                } else if(this.y <= left.y + 110){
                    this.angle += 20;
                }

            } else {
                right.point++;
                right.scoreboard.innerHTML = right.point;
                go_next = false;
                reset('right');
            }
        }

        // if ball is right
        if(this.x > width - 70 /* width of ball and right guy */) {

            // if ball hit the right guy!
            if(this.y >= right.y - 10 && this.y <= right.y + 110){
                this.angle = (90 - this.angle)  + 90;
                this.direction = -1;

                // make some angles for right guy!
                if(this.y <= right.y + 22){
                    this.angle += 20;
                } else if(this.y <= right.y + 44){
                    this.angle += 10;
                } else if(this.y <= right.y + 66){
                // do nothing
                } else if(this.y <= right.y + 88){
                    this.angle -= 10;
                } else if(this.y <= right.y + 110){
                    this.angle -= 20;
                }

            } else {
                left.point++;
                left.scoreboard.innerHTML = left.point;
                go_next = false;
                reset('left');
            }
        }

        // if ball is top
        if(this.y < 0) {
            this.angle = (90 - this.angle)  + 90;
        }

        // if ball is bottom
        if(this.y > height - 15 /* ball height */) {
            this.angle = -this.angle;
        }

        // if angle == 90, change it to 80!!!!
        if(this.angle == 90) this.angle = 80;

        this.setStyle('left', this.x);
        this.setStyle('top', this.y);

        if(go_next){
            move_ball.delay(500/this.speed, ball);
        }
    }

    function move(position, dummy, filename) {
        if((dummy == 'r' && who_you_are == 'groom') || (dummy == 'h' && who_you_are == 'bride')){
            filename = 'bride';
        } else {
            filename = 'groom';
        }

        if(position.getStyle('background-image') == 'url("' + filename + '1.png")'){
            position.setStyle('background-image', 'url("' + filename + '2.png")');
        }else{
            position.setStyle('background-image', 'url("' + filename + '1.png")');
        }
    }

    function reset(winner){
        if(left.point == max_point || right.point == max_point){
            finished();
            return;
        }

        ball.speed = 3;
        ball.time = 0;
        ball.angle = 30;
        if(winner == 'left'){
            ball.setStyle('left', 55);
            ball.direction = 1;
        } else {
            ball.setStyle('left', width - 70);
            ball.angle = 150 /* 180 - 30 */;
            ball.direction = -1;
        }
        ball.setStyle('top', 225);
        ball.x = ball.getStyle('left').toInt();
        ball.y = ball.getStyle('top').toInt();
        started = false;
    }

    function set_characters(whom){
        if(whom == 'groom'){
            who_you_are = 'groom';
            human = right;
            robot = left;
        }else{
            who_you_are = 'bride';
            human = left;
            robot = right;
        }

        // hide choose level! (third level)
        $$('div#third')[0].setStyle('display', 'none');
        level = 4;
    }

    function finished(){
        level = 5;
        if((left.point == max_point && who_you_are == 'bride') || (right.point == max_point && who_you_are == 'groom')){
            win = true;
        }

        if(win){
            $$('div#fifth')[0].setStyle('background-color', 'blue');
            $$('div#fifth')[0].innerHTML = '<p>Okey! press space to give address to you!</p>';
        } else {
            $$('div#fifth')[0].setStyle('background-color', 'red');
            $$('div#fifth')[0].innerHTML = '<p><small>Hey looser, play again and become oskol!<br/><br/>press space to play again!</small></p>';
            document.removeEvent('keydown');
        }

        $$('div#fifth')[0].setStyle('display', 'table');
    }
});

String.prototype.rot13 = function(){
    return this.replace(/[a-zA-Z]/g, function(c){
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

