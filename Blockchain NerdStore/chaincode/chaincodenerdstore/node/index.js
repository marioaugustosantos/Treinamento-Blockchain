/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const chaincodenerdstore = require('./lib/chaincodenerdstore');

module.exports.ChaincodeNerdStore = chaincodenerdstore;
module.exports.contracts = [chaincodenerdstore];
