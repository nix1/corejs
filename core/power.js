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
 * Power module
 * @requires {@link core/event}
 * @requires {@link core/tizen}
 * @namespace core/power
 * @memberof core
 */

define(
    'core/power',
    [
        'core/event',
        'core/tizen'
    ],
    function corePower(e, tizen) {
        'use strict';

        var power = null,

            RESOURCE = 'SCREEN',
            STATE_NORMAL = 'SCREEN_NORMAL',
            STATE_OFF = 'SCREEN_OFF',

            screenState = STATE_NORMAL;

        function noop() {
            return;
        }

        /**
         * Set screen power to normal.
         * @memberof core/power
         */
        function awake() {
            power.request(RESOURCE, STATE_NORMAL);
        }

        /**
         * Set screen power to default.
         * @memberof core/power
         */
        function normal() {
            power.release(RESOURCE);
        }

        /**
         * Returns true if device screen is on, false otherwise.
         * @memberof core/power
         * @return {boolean}
         */
        function isScreenOn() {
            return power.isScreenOn();
        }

        /**
         * Returns screen state.
         * @memberof core/power
         * @return {string}
         */
        function getScreenState() {
            if (!isScreenOn()) {
                return STATE_OFF;
            }
            return screenState;
        }

        /**
         * Screen state callback.
         * @memberof core/power
         * @param {string} previousState
         * @param {string} changedState
         * @fires "screen.from.screen_off"
         * @fires "screen.from.screen_normal"
         * @fires "screen.to.screen_off"
         * @fires "screen.to.screen_normal"
         * @fires "screen.changed"
         * @private
         */
        function onScreenStateChanged(previousState, changedState) {
            screenState = changedState;
            e.fire('screen.from.' + previousState.toLowerCase());
            e.fire('screen.to.' + changedState.toLowerCase());
            e.fire('screen.changed', {
                previousState: previousState,
                changedState: changedState
            });
        }

        /**
         * Registers view event listeners.
         */
        function bindEvents() {
            power.setScreenStateChangeListener(onScreenStateChanged);
        }

        /**
         * Initialise module and sets screen state change listener.
         * When screen state is changed, events listed in:
         * {@link core/power.onScreenStateChanged} are fired.
         * @memberof core/power
         * @private
         */
        function init() {
            if (typeof tizen === 'object' && typeof tizen.power === 'object') {
                power = tizen.power;
                bindEvents();
            } else {
                console.warn(
                    'tizen.power not available'
                );
                power = {
                    request: noop,
                    release: noop,
                    isScreenOn: noop
                };
            }
        }

        return {
            init: init,
            normal: normal,
            awake: awake,
            isScreenOn: isScreenOn,
            getScreenState: getScreenState
        };
    }
);
