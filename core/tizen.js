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

/*global define, tizen*/

/**
 * Tizen module.
 * Module returns tizen global object.
 * @requires {@link core/window}
 * @namespace core/tizen
 * @memberof core
  *
 * @example
 * //Define `foo` module which require `core/tizen` module:
 * define({
 *     name: 'foo',
 *     requires: ['core/tizen'],
 *     def: function (tizen) {
*          var systeminfo = tizen.systeminfo;
 *     }
 * });
 */

define({
    name: 'core/tizen',
    requires: [
        'core/window'
    ],
    def: function coreTizen(window) {
        'use strict';

        return window.tizen;
    }
});
