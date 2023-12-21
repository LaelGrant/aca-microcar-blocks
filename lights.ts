/**
 * Lights Blocks
 */
//% weight=48 color=#ff9f1f icon="\uf0e7" block="Lights"
//% groups=['Colours', 'Actions']
namespace lights {
    let strip = newopixel.create(DigitalPin.P1, 4, NewoPixelMode.RGB)

    /**
    * Show red
    */
    //% weight=0
    //% block="show red"
    //% group="Colours"
    function showRed() { //legacy function, no block for it
        strip.showColor(NewoPixelColors.Red)
    }

    /**
    * Clear lights:
    * Stop shining the micro:car lights
    */
    //% weight=90
    //% block="clear lights"
    //% group="Colours"
    export function clearAll() {
        strip.clear()
        strip.show()
    }

    /**
    * Show any colour:
    * Shine any colour with the micro:car lights
    */
    //% weight=100
    //% block="show |%colour"
    //% group="Colours"
    export function showAny(colour: NewoPixelColors) {
        strip.showColor(colour)
    }

    /**
    * Flash any colour
    */
    //% weight=100
    //% block="flash |%colour"
    //% group="Colours"
    export function flashAny(colour: NewoPixelColors) {
        strip.showColor(colour)
        basic.pause(500)
        strip.clear()
        strip.show()
    }

    /**
    * Make explosion movement and sound:
    * rattle motors, make noise on speaker, show a picture
    */
    //% weight=40
    //% block="explode"
    //% group="Actions" 
    //% advanced=true  
    export function explode() {
        let timer = 5
        let t = 60
        for (let index = 0; index <= timer; index++) {
            led.plot(2, 2)
            BitKit.setMotormoduleSpeed(-255, 255)
            strip.showColor(newopixel.colors(NewoPixelColors.Red))
            basic.pause((timer - index) * 40)
            strip.showColor(newopixel.colors(NewoPixelColors.Orange))
            basic.pause((timer - index) * 40)
            basic.clearScreen()
            BitKit.setMotormoduleSpeed(255, -255)
            strip.showColor(newopixel.colors(NewoPixelColors.Yellow))
            basic.pause((timer - index) * 40)
            strip.showColor(newopixel.colors(NewoPixelColors.White))
            basic.pause((timer - index) * 40)
        }
        BitKit.setMotormoduleSpeed(0, 0);
        basic.pause(100)
        music.playTone(988, 100);
        //fireworks animation

        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `, t)
        basic.showLeds(`
            . . . . .
            . . # . .
            . # . # .
            . . # . .
            . . . . .
            `, t)
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `, t)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `, t)
        basic.showLeds(`
            . . # . .
            . # . # .
            # . # . #
            . # . # .
            . . # . .
            `, t)
        basic.showLeds(`
            . # . # .
            # . # . #
            . # # # .
            # . # . #
            . # . # .
            `, t)
        basic.showLeds(`
            . # . # .
            # # . # #
            . . . . .
            # # . # #
            . # . # .
            `, t)
        basic.showLeds(`
            # # . # #
            # . . . #
            . . . . .
            # . . . #
            # # . # #
            `, t)
        basic.showLeds(`
            # . . . #
            . . . . .
            . . . . .
            . . . . .
            # . . . #
            `, t)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `, t)

    }

    /**
    * Shine the light a colour if there is coral underneath the micro:car.
    */
    //% weight=60
    //% blockId=if_there_is_coral block="if there is coral, then show |%colour"
    //% group="Actions"
    export function IfThereIsCoral(colour: NewoPixelColors) {
        //for (let index = 0; index < 2; index++) { //do it twice so it actually triggers
        //    if (BitKit.wasColorTriggered(ColorEvent.R)) {
        //        strip.showColor(colour)
        //    }
        //    basic.pause(250)
        //}
        //if (BitKit.wasColorTriggered(ColorEvent.R)) {
        if (BitKit.seeCustomDebounced(CustomColours.R)) {
            strip.showColor(colour)
            basic.pause(250)
            clearAll()
            basic.clearScreen()
        }
    }

    /**
    * Show light and sound on coral:
    * If there is coral, show a light and display a sound
    */
    //% weight=50
    //% group="Actions"
    export function IfThereIsCoralAnd(colour: NewoPixelColors) {
        let flag = 1
        for (let index = 0; index < 2; index++) { //do twice so the event actually triggers
            if (BitKit.wasColorTriggered(ColorEvent.R)) {
                strip.showColor(colour)
                if (flag == 1) { //make sure tone only plays once
                    music.playTone(Note.G, 1000)
                    flag = 0
                }
            }
            basic.pause(250)
        }
        clearAll()
        basic.clearScreen()
    }

    /**
    * Copy Colour
    * mimic the colour of the ground under the bot.
    * eg. see red, show red, see blue, show blue
    */
    //% advanced = true   
    //% block = "copy colour"
    //% weight=50
    export function copyColour() {
        if (BitKit.seeCustom(CustomColours.R)) {
            strip.showColor(NewoPixelColors.Red)
        }
        else if (BitKit.seeCustom(CustomColours.G)) {
            strip.showColor(NewoPixelColors.Green)
        }
        else if (BitKit.seeCustom(CustomColours.B)) {
            strip.showColor(NewoPixelColors.Blue)
        }
        else if (BitKit.seeCustom(CustomColours.P)) {
            strip.showColor(NewoPixelColors.Purple)
        }
        else if (BitKit.seeCustom(CustomColours.W)) {
            strip.showColor(NewoPixelColors.White)
        }
        else {
            strip.clear()
        }
        basic.pause(1000)
        strip.clear()
    }

    /**
    * Waddle left:
    * Move the microcar left without moving fowards and backwards.
    */
    //% advanced = true
    //% block = "waddle left"
    //% weight= 50
    export function waddleLeft() {
        strip.showColor(newopixel.colors(NewoPixelColors.Green))
        basic.showLeds(`
            . . # . .
            . # . . .
            # # # # #
            . # . . .
            . . # . .
            `)
        for (let i = 0; i < 6; i++) {
            BitKit.setMotormoduleSpeed(0, 255)
            basic.pause(500)
            BitKit.setMotormoduleSpeed(255, 0)
            basic.pause(500)
            BitKit.setMotormoduleSpeed(0, -255)
            basic.pause(500)
            BitKit.setMotormoduleSpeed(-255, 0)
            basic.pause(500)
        }
        BitKit.setMotormoduleSpeed(0, 0)
        basic.clearScreen()
        clearAll()
    }

    /**
     * Dump Truck:
     * Dump the trucks load onto the ground
     * Rains material down LED face, rumbles motors.
     */
    //% advanced = true
    //% block = "dump truck"
    //% weight = 45
    export function dumpTruck() {
        BitKit.stopMotormodule() //stop before dumping material
        strip.showColor(newopixel.colors(NewoPixelColors.Orange))
        //two beeps
        for (let b = 0; b < 2; b++) {
            music.playTone(Note.GSharp5, 700)
            basic.pause(700)
        }
        basic.pause(700)
        //rumble
        for (let lo = 0; lo < 4; lo++) {
            strip.showColor(newopixel.colors(NewoPixelColors.Red))
            for (let index = 0; index < 5; index++) {
                basic.clearScreen()
                led.plot(Math.randomRange(0, 4), (index - 3) % 5)
                led.plot(Math.randomRange(0, 4), index)
                led.plot(Math.randomRange(0, 4), (index - 1) % 5)
                led.plot(0, (index - 1) % 5)
                led.plot(3, (index - 4) % 5)
                BitKit.setMotormoduleSpeed(-255, 255)
                basic.pause(80)
                BitKit.setMotormoduleSpeed(255, -255)
                basic.pause(80)
            }
            lights.clearAll()
            for (let index = 0; index < 5; index++) {
                basic.clearScreen()
                led.plot(Math.randomRange(0, 4), (index - 3) % 5)
                led.plot(Math.randomRange(0, 4), (index - 1) % 5)
                led.plot(Math.randomRange(0, 4), (index) % 5)
                led.plot(2, (index - 1) % 5)
                led.plot(0, (index - 2) % 5)
                led.plot(4, (index - 4) % 5)
                BitKit.setMotormoduleSpeed(-255, 255)
                basic.pause(80)
                BitKit.setMotormoduleSpeed(255, -255)
                basic.pause(80)
            }
        }
        BitKit.stopMotormodule()
        basic.pause(1000)
        basic.clearScreen()
    }
}
