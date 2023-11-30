enum LeftorRight {
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
    * Turn Right/Left until line
    */
    //% weight=96
    //% block="go |%direction|"
    //% group="Grid"
    export function turnUntilLine(direction: LeftorRight) {
        let rw, lw, rw2, lw2 = 0;
        if (direction == 2){ //right
            lw = 200;
            rw = 65; //changed from 60 t0 65 to fix underturning & missing line
            lw2 = 200;
            rw2 = 0;
        }
        else if (direction == 1){ //left
            lw = 65;
            rw = 200;
            lw2 = 0;
            rw2 = 200;
        }
        
        if (direction !=3){ //if turning
            
            BitKit.setMotormoduleSpeed(lw, rw); //drive forwards in a turn to clear dot
            basic.pause(500);
            driver.i2cSendByte(SensorType.Liner, 0x02);
            let event = driver.i2cReceiveByte(SensorType.Liner); //move until you hit the DAL.DEVICE_PIN_DEFAULT_SERVO_CENTER sensor on line
            while (event != LinerEvent.Middle) {
                driver.i2cSendByte(SensorType.Liner, 0x02);
                event = driver.i2cReceiveByte(SensorType.Liner);
            }

        }
        else { //if straight
            BitKit.setMotormoduleSpeed(200,200); //move forwards to clear dot
            basic.pause(900); //upped from 800 to suit gina
        }
        //BitKit.setMotormoduleSpeed(0, 0); //removed to allow better PRIMM for students (no stopping in their code). 
        //basic.pause(600)
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
            BitKit.setMotormoduleAction(DirectionTpye.Forward, SpeedTpye.Medium)
            basic.pause(200) //found dot, move closer to center (technically, lost line - TODO, change check here)
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
