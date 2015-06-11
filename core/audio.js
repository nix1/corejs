/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global define, console*/

/**
 * Audio module
 * @requires {@link core/window}
 * @namespace core/audio
 * @memberof core
 */

define({
    name: 'core/audio',
    requires: [
        'core/window'
    ],
    def: function coreAudio(window) {
        'use strict';

        var MAX_VOLUME = 15,

            audio = new window.Audio();

        /**
         * Set audio volume
         * @param {number} value
         */
        function setVolume(value) {
            audio.volume = value / MAX_VOLUME;
        }

        /**
         * Set audio file path
         * @memberof core/audio
         * @param {string} path
         */
        function setFile(path) {
            audio.src = path;
            audio.autoplay = false;
            audio.loop = false;
            audio.load();
        }

        /**
         * Pause playing audio
         * @memberof core/audio
         */
        function pause() {
            audio.pause();
        }

        /**
         * Set audio loop flag
         * @memberof core/audio
         * @param {boolean} flag
         */
        function loop(flag) {
            audio.loop = flag;
        }

        /**
         * Add audio callback for events.
         * @memberof core/audio
         * @param {object} options Options.
         * @param {object} options.event
         * @param {function} options.callback
         */
        function addAudioCallback(options) {
            audio.addEventListener(options.event, options.callback);
        }

        /**
         * Remove audio callback for events.
         * @memberof core/audio
         * @param {object} options Options.
         * @param {object} options.event
         * @param {function} options.callback
         */
        function removeAudioCallback(options) {
            audio.removeEventListener(options.event, options.callback);
        }

        /**
         * Starts playing audio.
         * @memberof core/audio
         * @param {object} [options] Options.
         * @param {string} [options.file] File path.
         * @param {number} [options.volume]
         * @param {boolean} [options.loop]
         * @return {boolean}
         */
        function play(options) {
            options = options || {};

            if (options.file !== undefined) {
                setFile(options.file);
            }

            if (options.volume !== undefined) {
                setVolume(options.volume);
            }

            if (options.loop !== undefined) {
                loop(options.loop);
            }

            if (!audio.src) {
                console.error('No file to play!');
                return false;
            }

            audio.play();

            return true;
        }

        return {
            /**
             * Max volume value.
             * @memberof core/audio
             * @constant {number} MAX_VOLUME
             */
            MAX_VOLUME: MAX_VOLUME,
            setFile: setFile,
            play: play,
            pause: pause,
            addAudioCallback: addAudioCallback,
            removeAudioCallback: removeAudioCallback,
            loop: loop
        };
    }
});
