const reload = async (envs = {}, injectDefaultBase = true) => {
  const keys = [
    'NODE_ENV',
    'CONFIG_BASEDIR',
    'NODE_CONFIG_BASEDIR',
    'CONFIG_DIR',
    'NODE_CONFIG_DIR',
    'CONFIG',
    'NODE_CONFIG'
  ]
  for (const k of keys) delete process.env[k]
  Object.assign(process.env, injectDefaultBase ? { CONFIG_BASEDIR: __dirname } : {}, envs)
  jest.resetModules()
  const mod = await import('../index.js')
  return mod.default ?? mod
}

test('loads default JSON config', async () => {
  const cfg = await reload()
  expect(cfg.a).toBe(1)
  expect(cfg.nested.default).toBe(1)
})

test('env JSON overrides default', async () => {
  const cfg = await reload({ NODE_ENV: 'production' })
  expect(cfg.a).toBe(2)
  expect(cfg.nested.default).toBe(1)
  expect(cfg.feature.enabled).toBe(true)
})

test('loads JS config', async () => {
  const cfg = await reload({ NODE_ENV: 'dev' })
  expect(cfg.jsFlag).toBe(true)
  expect(cfg.nested.dev).toBe(3)
})

test('loads YAML via mocked parser', async () => {
  const cfg = await reload({ NODE_ENV: 'yaml' })
  expect(cfg.port).toBe(3001)
  expect(cfg.nested.yaml).toBe(true)
})

test('loads TOML via mocked parser', async () => {
  const cfg = await reload({ NODE_ENV: 'toml' })
  expect(cfg.port).toBe(3002)
  expect(cfg.nested.toml).toBe(true)
})

test('logs error when env file missing', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    const cfg = await reload({ NODE_ENV: 'missing' })
    expect(spy).toHaveBeenCalled()
    expect(cfg).toBeDefined()
  } finally {
    spy.mockRestore()
  }
})

test('falls back to default when custom env file missing', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    const cfg = await reload({ NODE_ENV: 'nonexistent' })
    // Should log error for missing custom file
    expect(spy).toHaveBeenCalledWith('config-lite load "nonexistent" failed.')
    // Should also log the error stack containing "Cannot find module 'nonexistent'" or "Cannot find module \"nonexistent\""
    const errorCalls = spy.mock.calls.flat().join(' ')
    expect(errorCalls).toMatch(/Cannot find module ['"]nonexistent['"]/)

    // But should still load default.json successfully
    expect(cfg.a).toBe(1)
    expect(cfg.nested.default).toBe(1)
  } finally {
    spy.mockRestore()
  }
})

test('logs error when default file missing', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  try {
    const cfg = await reload({ CONFIG_DIR: 'no-such-dir' })
    expect(spy).toHaveBeenCalled()
    expect(cfg).toBeDefined()
  } finally {
    spy.mockRestore()
  }
})

test('NODE_CONFIG overrides file values', async () => {
  const cfg = await reload({ NODE_CONFIG: '{"a":999,"nested":{"default":0}}' })
  expect(cfg.a).toBe(999)
  expect(cfg.nested.default).toBe(0)
})

test('throws on invalid NODE_CONFIG JSON', async () => {
  await expect(reload({ NODE_CONFIG: '{"a":' })).rejects.toThrow(SyntaxError)
})

test('uses NODE_CONFIG_BASEDIR when CONFIG_BASEDIR is unset', async () => {
  const cfg = await reload({ NODE_CONFIG_BASEDIR: __dirname }, false)
  expect(cfg.a).toBe(1)
  expect(cfg.nested.default).toBe(1)
})

test('falls back to __dirname when both base envs unset', async () => {
  const cfg = await reload({ CONFIG_DIR: '__test__/config' }, false)
  expect(cfg.a).toBe(1)
  expect(cfg.nested.default).toBe(1)
})
