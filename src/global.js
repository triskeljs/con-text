
export function getGlobalThis () {
  if( typeof globalThis !== 'undefined' ) return globalThis // eslint-disable-line no-undef
  if( typeof self !== 'undefined' ) return self
  if( typeof window !== 'undefined' ) return window
  if( typeof global !== 'undefined' ) return global

  // Note: this might still return the wrong result!
  if( typeof this !== 'undefined' ) return this
  throw new Error('Unable to locate global `this`')
}

const global = getGlobalThis()

export default global
