/*global define, setInterval, clearInterval*/

/**
 * Timer module.
 * @requires {@link core/event}
 * @namespace core/timer
 */

define(
    'core/timer',
    [
        'core/event'
    ],
    function coreTimer(e) {
        'use strict';

        /**
         * Lap object.
         *
         * @constructor
         * @param {number} no Number of lap.
         * @param {number} time Time between this and previous lap.
         */
        function Lap(no, time) {
            this.no = no;
            this.time = time;
        }

        /**
         * Timer class.
         *
         * @constructor
         * @param {type} delay Delay in milliseconds.
         * @param {string|function|array} callbacks Events/functions to be
         * fired.
         */
        function Timer(delay, callbacks) {
            var that = this;

            if (typeof callbacks === 'function' ||
                typeof callbacks === 'string') {
                callbacks = [callbacks];
            } else if (callbacks === undefined) {
                callbacks = [];
            }
            this.reset();
            this.callbacks = callbacks;
            this.delay = delay;
            this.id = setInterval(function tick() {
                that.tick();
            }, this.delay);
        }

        Timer.prototype = {

            /**
             * Pauses the timer.
             *
             * After calling the 'run' method, it will continue counting.
             *
             * @throws {Error} Throws an error if the timer is not running.
             * @return {Timer} This object for chaining.
             */
            pause: function pause() {
                if (this.status !== 'running') {
                    throw new Error('Can pause only a running timer');
                }
                this.status = 'paused';
                this.timePaused = Date.now();
                return this;
            },

            /**
             * Resets the timer to 0 and 'ready' state.
             *
             * @return {Timer} This object for chaining.
             */
            reset: function reset() {
                this.status = 'ready';
                this.count = 0;
                this.startTime = null;
                // reset laps
                this.lapNo = 1;
                this.lastLapTime = 0;
                return this;
            },

            /**
             * Runs the timer.
             *
             * @throws {Error} Throws an error if already stopped.
             * @param {number} initial Initial time to start counting from
             * @return {Timer} This object for chaining.
             */
            run: function run(initial) {
                switch (this.status) {
                    case 'ready':
                        this.startTime = Date.now();
                        if (initial) {
                            this.startTime = this.startTime - initial;
                        }
                        break;
                    case 'paused':
                        // Adjust the startTime by the time passed since the
                        // pause so that the time elapsed remains unchanged.
                        this.startTime += Date.now() - this.timePaused;
                        break;
                    case 'running':
                        // already running
                        return this;
                    case 'stopped':
                        throw new Error('Can\'t run a stopped timer again');
                }
                this.status = 'running';
                return this;
            },

            /**
             * Stops the timer.
             *
             * SetInterval is cleared, so unlike pause, once you stop timer,
             * you can't run it again.
             *
             * @return {Timer} This object for chaining.
             */
            stop: function stop() {
                clearInterval(this.id);
                this.status = 'stopped';
                this.timePaused = null;
                return this;
            },

            /**
             * Returns elapsed time on the timer.
             * @return {number}
             */
            getTimeElapsed: function getTimeElapsed() {
                if (this.status === 'running') {
                    return Date.now() - this.startTime;
                }
                if (this.status === 'paused') {
                    return this.timePaused - this.startTime;
                }
                return 0;
            },

            /**
             * Returns lap object.
             * @return {Lap}
             */
            lap: function lap() {
                var lapObj = new Lap(
                    this.lapNo,
                    // lap time is total time minus previous lap time
                    this.getTimeElapsed() - this.lastLapTime
                );
                this.lastLapTime = this.getTimeElapsed();
                this.lapNo += 1;
                return lapObj;
            },

            /**
             * Tick handling.
             *
             * Fires all events/callbacks and updates the 'count'
             *
             * @private
             * @return {Timer} This object for chaining.
             */
            tick: function tick() {
                var i;
                if (this.status !== 'running') {
                    return this;
                }
                for (i = 0; i < this.callbacks.length; i += 1) {
                    if (typeof this.callbacks[i] === 'string') {
                        e.fire(this.callbacks[i], this);
                    } else if (typeof this.callbacks[i] === 'function') {
                        this.callbacks[i].call(this);
                    }
                }
                this.count += 1;
                return this;
            }
        };

        return {
            Timer: Timer
        };
    }
);

