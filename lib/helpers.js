const pick = (object, paths) =>
  paths.reduce(
    (picked, path) => Object.assign(picked, { [path]: object[path] }),
    {}
  )

module.exports = { pick }
