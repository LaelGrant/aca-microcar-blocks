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
            BitKit.setMotormoduleSpeed(200, 200);
            basic.pause(150);
            lw = 65;
            rw = 200;
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Middle)) { //testing
                BitKit.setMotormoduleSpeed(lw, rw);
            }
        }

        else if (direction == 2){ //right
            BitKit.setMotormoduleSpeed(200, 200);
            basic.pause(150);
            lw = 200;
            rw = 65; //changed from 60 t0 65 to fix underturning & missing line
            while (!BitKit.wasLinePositionTriggered(LinerEvent.Middle)) { //testing
                BitKit.setMotormoduleSpeed(lw, rw);
            }
        }

        else if(direction == 3) { //going straight
            let foundLine = false;
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
                    basic.pause(100); //check all lines every 100ms movement
                }
            }
        }   
        else {  //turning
            BitKit.setMotormoduleSpeed(lw, rw); //drive forwards in a turn to clear dot
            basic.pause(500);
            driver.i2cSendByte(SensorType.Liner, 0x02);
            let event = driver.i2cReceiveByte(SensorType.Liner); //move until you hit the DAL.DEVICE_PIN_DEFAULT_SERVO_CENTER sensor on line
            while (event != LinerEvent.Middle) {
                driver.i2cSendByte(SensorType.Liner, 0x02);
                event = driver.i2cReceiveByte(SensorType.Liner);
            }
        }

    }

    /**
    * Continue Straight (over dot) until any line found
    */
    //% weight=95
    //% block="go straight over dot"
    //% group="Grid"
    export function goOverDot() {
        let foundLine = false;
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
                basic.pause(100); //upped from 800 to suit gina
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

        while (!(BitKit.wasAllLinePosTriggered())) {
            if (BitKit.wasLinePositionTriggered(LinerEvent.Middle)) {
                BitKit.setMotormoduleAction(DirectionTpye.Forward, SpeedTpye.Medium)
            } else if (BitKit.wasLinePositionTriggered(LinerEvent.Left)) {
                BitKit.setMotormoduleAction(DirectionTpye.Left, SpeedTpye.Medium)
            } else if (BitKit.wasLinePositionTriggered(LinerEvent.Right)) {
                BitKit.setMotormoduleAction(DirectionTpye.Right, SpeedTpye.Medium)
            } else if (BitKit.wasLinePositionTriggered(LinerEvent.Rightmost)) {
                BitKit.setMotormoduleAction(DirectionTpye.Right, SpeedTpye.Medium)
            } else if (BitKit.wasLinePositionTriggered(LinerEvent.Leftmost)) {
                BitKit.setMotormoduleAction(DirectionTpye.Left, SpeedTpye.Medium)
            }
        }
        if (BitKit.wasAllLinePosTriggered()) {
            //BitKit.setMotormoduleAction(DirectionTpye.Forward, SpeedTpye.Medium)
            //basic.pause(200) //found dot, move closer to center (technically, lost line - TODO, change check here)
            BitKit.stopMotormodule()
            basic.pause(500) //stop briefly to indicate found dot
        }
    }
}

namespace ws2812b_cp {
    //% shim=sendBufferAsm
    export function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }
}
