#!/usr/bin/env node
import { readContractAddress, getPreviewUrl } from './network';

console.log('Preview URL:', getPreviewUrl());
console.log('Contract address:', readContractAddress() ?? 'not configured');
