enum SensorType {
    //% block=Sound Sensor
    Sound = 6,
    //% block=Gesture Sensor
    Gesture = 0x0c,
    //% block=Knob
    Knob = 0x10,
    //% block=Color Line Follower
    Liner = 0x27

};

enum ColorEvent {
    //% block=red
    R = 2,
    //% block=green
    G = 3,
    //% block=blue
    B = 4,
    //% block=black
    Black = 1,
    //% block=others
    Other = 5
};

//colours expanded to also cover Auto 5 - LG
enum CustomColours { //made by Penny
    //%block=red
    R,
    //%block=orange
    O,
    //%block=yellow
    Y,
    //%block=green
    G,
    //%block=blue
    B,
    //%block=white
    W,
    //%block=purple
    P,
    //%block=black
    Bl
};

enum LinerEvent {
    //% block=middle
    Middle = 1,
    //% block=left
    Left = 3,
    //% block=leftmost
    Leftmost = 4,
    //% block=right
    Right = 5,
    //% block=rightmost
    Rightmost = 6,
    //% block=lost
    Lost = 2
};

enum MotorType {
    //% block=servo
    Servo = 0x24,
    //% block=wheel
    Wheel = 0x28
};

enum SpeedType {
    //% block=slow
    Slow = 120,
    //% block=medium
    Medium = 200,
    //% block=fast
    Fast = 255
};

enum DirectionType {
    //% block=forward
    Forward = 1,
    //% block=backward
    Backward = 2,
    //% block=left
    Left = 3,
    //% block=right
    Right = 4,
    //% block=clockwise
    Clockwise = 5,
    //% block=counter-clockwise
    Anticlockwise = 6
};

enum MotionType {
    //% block="random direction"
    Random = 0,
    //% block=automatically
    Auto = 1
};


/**
 * Extension blocks
 */
//% weight=48 color=#4646DF icon="\uf018" block="Microcar"
//% groups="['Colour Sensor', 'Line Sensor', 'Car', 'Event Line Follower', 'others']"
namespace BitKit {

    /**
     * Set the actions and the moving speed of the motormodule.
     * @param direction the direction that want to set.
     * @param speed the speed that want to run.
     */
    //% blockId=motor_set_action block="go|%direction|at|%speed speed"
    //% weight=100
    //% group="Car"
    export function setMotormoduleAction(direction: DirectionType, speed: SpeedType) {
        basic.pause(1);
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x01;
        if (direction == DirectionType.Forward) {
            data[1] = speed & 0xff;
            data[2] = (speed >> 8) & 0xff;
            data[3] = speed & 0xff;
            data[4] = (speed >> 8) & 0xff;
        }
        else if (direction == DirectionType.Backward) {
            data[1] = (-speed) & 0xff;
            data[2] = ((-speed) >> 8) & 0xff;
            data[3] = (-speed) & 0xff;
            data[4] = ((-speed) >> 8) & 0xff;
        }
        else if (direction == DirectionType.Left) {
            data[1] = 0 & 0xff;
            data[2] = (0 >> 8) & 0xff;
            data[3] = speed & 0xff;
            data[4] = (speed >> 8) & 0xff;
        }
        else if (direction == DirectionType.Right) {
            data[1] = speed & 0xff;
            data[2] = (speed >> 8) & 0xff;
            data[3] = 0 & 0xff;
            data[4] = (0 >> 8) & 0xff;
        }
        else if (direction == DirectionType.Clockwise) {
            data[1] = speed & 0xff;
            data[2] = (speed >> 8) & 0xff;
            data[3] = (-speed) & 0xff;
            data[4] = ((-speed) >> 8) & 0xff;
        }
        else if (direction == DirectionType.Anticlockwise) {
            data[1] = (-speed) & 0xff;
            data[2] = ((-speed) >> 8) & 0xff;
            data[3] = speed & 0xff;
            data[4] = (speed >> 8) & 0xff;
        }
        driver.i2cSendBytes(MotorType.Wheel, data);
    }

    /**
     * Stop the motormodule.
     */
    //% blockId=motor_stop_run block="stop"
    //% weight=99
    //% group="Car"
    export function stopMotormodule() {
        setMotormoduleSpeed(0, 0);
    }

    /**
     * Set the speed of the motors.
     * @param left the left speed you want to run.
     * @param right the right speed you want to run.
     */
    //% blockId=motor_set_speed_with_duty block="left motor|%left|, right motor |%right"
    //% left.min=-255 left.max=255 left.defl=0
    //% right.min=-255 right.max=255 right.defl=0
    //% weight=98
    //% group="Car"
    export function setMotormoduleSpeed(left: number, right: number) {
        let data: Buffer = pins.createBuffer(5);
        data[0] = 0x01;
        data[1] = left & 0xff;
        data[2] = (left >> 8) & 0xff;
        data[3] = right & 0xff;
        data[4] = (right >> 8) & 0xff;
        driver.i2cSendBytes(MotorType.Wheel, data);
    }

    export let linerEventValue = 0;
    const eventIdLiner = 9000;
    let initLiner = false;
    let lastLiner = 0;

    /**
     * Do something when the line follower recognized the position of the line underneath.
     * @param event type of liner to detect
     * @param handler code to run
     */
    //% blockId=sensor_liner_create_event block="on Color Line Follower line position|%event"
    //% weight=100 
    //% advanced=true
    export function onLinePosition(event: LinerEvent, handler: () => void) {
        control.onEvent(eventIdLiner, event, handler);
        if (!initLiner) {
            initLiner = true;
            control.inBackground(() => {
                while (true) {
                    driver.i2cSendByte(SensorType.Liner, 0x02);
                    const event = driver.i2cReceiveByte(SensorType.Liner);
                    if (event > 2) linerEventValue = event;
                    if (event != lastLiner) {
                        lastLiner = event;
                        control.raiseEvent(eventIdLiner, lastLiner);
                    }
                    basic.pause(50);
                }
            })
        }
    }

    /**
     * Do something when the color sensor detects a specific color.
     * @param event type of color to detect
     * @param handler code to run
     */
    //% blockId=sensor_color_create_event block="on Color Line Follower see |%event"
    //% weight=99
    //% advanced=true
    export function onColor(event: ColorEvent, handler: () => void) {
        const eventId = driver.subscribeToEventSource(SensorType.Liner);
        control.onEvent(eventId, event, handler);
    }

    /**
     * Check if the line follower can see a line at a position.
     * @param event of liner device
     */
    //% blockId=sensor_is_liner_event_generate block="see line at|%position|"
    //% weight=98
    //% group="Line Sensor"
    export function wasLinePositionTriggered(position: LinerEvent): boolean {
        basic.pause(1) //give event a chance to trigger
        let eventValue = position;
        if (!initLiner) onLinePosition(position, () => { });
        if (lastLiner == eventValue) return true;
        return false;
    }
    
    /**
     * If line sensor is lost
     */
 
    //% weight=99
    //% group="Line Sensor"
    export function wasAllLinePosTriggered(): boolean {
        basic.pause(1) //give event a chance to trigger
        driver.i2cSendByte(SensorType.Liner, 0x02); //manually check lost trigger
        let e = driver.i2cReceiveByte(SensorType.Liner);
        //basic.showNumber(e)
        if (e == 2) return true;
        return false
    }

    /**
     * See if the color sensor detected a specific color.
     * @param event of color device
     */
    //% weight=0
    //% group="Colour Sensor"
    export function wasColorTriggered(event: ColorEvent): boolean {
        let eventValue = event;
        if (driver.addrBuffer[SensorType.Liner] == 0) onColor(event, () => { });
        if (driver.lastStatus[SensorType.Liner] == eventValue) return true;
        return false;
    }



    /**
     * Get the color value from the color sensor in R:G:B.
     */
    //% blockId=sensor_get_color_rgb block="Color Line Follower color value"
    //% weight=96
    //% advanced=true
    export function getColor(): number {
        let data: Buffer = pins.createBuffer(4);
        driver.i2cSendByte(SensorType.Liner, 0x04);
        data = driver.i2cReceiveBytes(SensorType.Liner, 4);
        return (data[0] + data[1] * 256 + data[2] * 65536);
    }


    //red, orange, yellow, green, blue, white, purple, black //manual copy of enum above. 
    let colours: number[] = [0, 1, 2, 3, 4, 6];  //no black or white

    /**
     * Check if the colour sensor detected any custom colour (NOT B/W)
     */
    //%blockId=see_any_colour block="see any colour"
    //% weight=97
    //% group="Colour Sensor"
    export function checkForAnyCustomColour(): boolean {
        let found: boolean = false
        let index = 0
        while(index < colours.length)
        {
            if (seeCustom(colours[index]) == true){  //NOTE that this calls debounced colour check, which has a threshold of 6 sequential positives
                found = true
                index = colours.length
            }
            else{
                index ++;
            }

        }
        return found
    }

    let lastDetectedColour = -1
    let colDetectionFreq = 0

    /**
     * Check if the colour sensor detected any of the custom colours
     * Debounced by checking if the detected colour matches the previously 
     * detected colour, and triggering positive once a threshold sequential positives is reached.
     * Resets once a different colour is detected
     */
    //%blockId=i2c_db block="see colour db |%colour|"
    //% weight=98
    //% group="Colour Sensor"

    export function seeCustom(colour: CustomColours): boolean {
        let detectedColour = -1     //default to invalid colour
        let colDetThreshold = 6    //min seq. sensor match before triggering positive return
        
        //separate colour channels
        let col = getColor()
        let r = col >>> 16
        let g = (col & 0xFF00) >>> 8
        let b = col & 0xFF

        //basic.pause(1)  //debounced increases detection latency, so pause removed
        //colour conversion to HSL
        //adapted from https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(Math.max(r, g), b);
        let min = Math.min(Math.min(r, g), b);
        let d = max - min;
        let h;
        if (d === 0) h = 0;
        else if (max === r) h = (g - b) / d % 6;
        else if (max === g) h = (b - r) / d + 2;
        else if (max === b) h = (r - g) / d + 4;
        let l = (min + max) / 2;
        let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
        h *= 60
        if (h < 0) h += 360 //fix wrap around

        //colour identification
        if (s > 0.3 && l > 0.15 && l < 0.95) { //don't bother if it's too grey or black
            if (h > 350 || h < 12 && l < 0.85 && s > 0.78) { //saturation high to prevent map bg being detected
                detectedColour = CustomColours.R;
            }
            if (h > 12 && h < 36 && l > 0.5 && s > 0.9) { //saturation high to prevent map bg being detected
                detectedColour = CustomColours.O;
            }
            if (h > 35 && h < 63) { //
                detectedColour = CustomColours.Y;
            }
            if (h > 63 && h < 160) {
                detectedColour = CustomColours.G;
            }
            if (h > 160 && h < 265 && l < 0.85) { //blue bluer than red, green fires high
                detectedColour = CustomColours.B;
            }
            if (h > 265 && h < 350 && l < 0.85) { // both red and blue more than green by a bit
                detectedColour = CustomColours.P;
            }
        }
        //separate bit for white
        else if (colour == CustomColours.W && col > 16759431) { //almost white (FFBA87), might need to lower Rval
            detectedColour = CustomColours.W;
        }
        //separate bit for black 
        else if(s < 0.1 || l < 0.1){  //should be accurate & a little more permissive for black detection
        //else if (colour == CustomColours.Bl && r * 255 < 0x10 && g * 255 < 0x10 && b * 255 < 0x10) {//all low light
            detectedColour = CustomColours.Bl;
        }
        //Debounce colour detection
        if(detectedColour == lastDetectedColour){   //sensed same colour again, increment frequency
            colDetectionFreq += 1;
            if (colDetectionFreq > colDetThreshold && detectedColour == colour ) {  //check if it's actually what we're looking for
                return true
            }
            else {
                return false
            }
        }
        else    //new colour detected, reset count
        {
            colDetectionFreq = 0
            lastDetectedColour = detectedColour
            return false
        }

    }


}