enum DirectionNames {
    straight = 3,
    left = 1,
    right = 2,
};

/**
 * Grid Blocks
 */
//% weight=48 color=#FF6523 icon="\uf009" block="Grid"
//% groups="['Setup', 'Grid']"
namespace grid {
    let strip: newopixel.Strip = null //make strip

    /**
    * Go Straight/Right/Left until line
    */
    //% weight=96
    //% block="go |%direction| until line"
    //% group="Grid"
    export function turnUntilLine(direction: DirectionNames) {
        let rw, lw = 0;

        if (direction == 1){ //left
            lw = 55;
            rw = 200;
            BitKit.setMotormoduleSpeed(200, 200);
            basic.pause(375);
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Leftmost)){ //least overlap with outside white/colour overlap
                BitKit.setMotormoduleSpeed(lw , rw);
            }
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Middle)){  //bring it back to center now middle is on white
                BitKit.setMotormoduleSpeed(lw , rw);
            }
            basic.pause(50)
            BitKit.setMotormoduleSpeed(200, 200); //stop turning - necessary as line event only triggers on change, so otherwise line following continues until it adjusts... 
        }

        if (direction == 2){ //right
            lw = 200;
            rw = 55;
            BitKit.setMotormoduleSpeed(200, 200);
            basic.pause(375);
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Rightmost)){
                BitKit.setMotormoduleSpeed(lw , rw);
            }
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Middle)){
                BitKit.setMotormoduleSpeed(lw , rw);
            }
            basic.pause(50)
            BitKit.setMotormoduleSpeed(200, 200); //stop turning
        }

        //if (direction != 3) {
        //    BitKit.setMotormoduleSpeed(200, 200);
        //    basic.pause(300);
        //    BitKit.setMotormoduleSpeed(lw, rw);
        //    driver.i2cSendByte(SensorType.Liner, 0x02);
        //    let event = driver.i2cReceiveByte(SensorType.Liner); //move until you hit the DAL.DEVICE_PIN_DEFAULT_SERVO_CENTER sensor on line
        //    while (event != LinerEvent.Middle) {
        //        driver.i2cSendByte(SensorType.Liner, 0x02);
        //        event = driver.i2cReceiveByte(SensorType.Liner);
        //    }
        //}

        else if(direction == 3) { //going straight
            let foundLine = false;
            //BitKit.setMotormoduleSpeed(200, 200);
            //basic.pause(800); //brute force clear dot as edge of dot can trigger line detection
            while (!foundLine){ 
                foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Leftmost)
                if (!foundLine) {
                    foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Left)
                }
                if (!foundLine) {
                    foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Middle)
                }
                if (!foundLine) {
                    foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Right)
                }
                if (!foundLine) {
                    foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Rightmost)
                }
                if (!foundLine) { 
                    BitKit.setMotormoduleSpeed(200,200); //move forwards to clear dot
                    basic.pause(50); //check all lines every ###ms movement
                }
            }
        }   
        //else {  //turning
        //   BitKit.setMotormoduleSpeed(lw, rw); //drive forwards in a turn to clear dot
        //    basic.pause(500);
        //    driver.i2cSendByte(SensorType.Liner, 0x02);
        //    let event = driver.i2cReceiveByte(SensorType.Liner); //move until you hit the DAL.DEVICE_PIN_DEFAULT_SERVO_CENTER sensor on line
        //    while (event != LinerEvent.Middle) {
        //        driver.i2cSendByte(SensorType.Liner, 0x02);
        //        event = driver.i2cReceiveByte(SensorType.Liner);
        //    }
        //}

    }

    /**
    * Continue Straight (over dot) until any line found
    */
    //% weight=95
    //% block="go straight over dot"
    //% group="Grid"
    export function goOverDot() {
        let foundLine = false;
        while (BitKit.checkForAnyCustomColour()) { //Follow until lose the line / multiple triggered
            BitKit.setMotormoduleSpeed(200,200); 
            basic.pause(100);
        }
        while (!foundLine){ 
            foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Leftmost)
            if (!foundLine) {
                foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Left)
            }
            if (!foundLine) {
                foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Middle)
            }
            if (!foundLine) {
                foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Right)
            }
            if (!foundLine) {
                foundLine = BitKit.wasLinePositionTriggered(LinerEvent.Rightmost)
            }
            if (!foundLine) { 
                BitKit.setMotormoduleSpeed(200,200); 
                basic.pause(100); 
            }
        }
    }

    /**
    * Follow line
    */
    //% weight=94
    //% block="follow line until dot"
    //% group="Grid"
    export function line_follow () {
        let foundDot = false;
        while (foundDot == false) { //Follow until lose the line / multiple triggered
            while (!(BitKit.wasAllLinePosTriggered())) { //Follow until lose the line / multiple triggered
                if (BitKit.wasLinePositionTriggered(LinerEvent.Middle)) {
                    BitKit.setMotormoduleAction(DirectionTpye.Forward, SpeedTpye.Medium)
                } else if (BitKit.wasLinePositionTriggered(LinerEvent.Left)) {
                    BitKit.setMotormoduleAction(DirectionTpye.Left, SpeedTpye.Medium)
                } else if (BitKit.wasLinePositionTriggered(LinerEvent.Right)) {
                    BitKit.setMotormoduleAction(DirectionTpye.Right, SpeedTpye.Medium)
                } else if (BitKit.wasLinePositionTriggered(LinerEvent.Rightmost)) {
                    BitKit.setMotormoduleAction(DirectionTpye.Right, SpeedTpye.Fast)
                } else if (BitKit.wasLinePositionTriggered(LinerEvent.Leftmost)) {
                    BitKit.setMotormoduleAction(DirectionTpye.Left, SpeedTpye.Fast)
                }
            }
            //TODO - add in flag, and then check for line triggers and then colour to exit loop? 
            if (BitKit.checkForAnyCustomColour()) { //Lost the line, check for any coloured (dot)
                foundDot = true
                }
            //else
            //{
            //    BitKit.setMotormoduleSpeed(200,200);  //lost line, and colour drive forwards to try to re-find line
            //    basic.pause(100); 
            //}
        }
        BitKit.stopMotormodule()
        basic.pause(500) //stop briefly to indicate found dot
    }
}

namespace ws2812b_cp {
    //% shim=sendBufferAsm
    export function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }
}


