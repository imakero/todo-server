const pick = (object, paths) =>
  paths.reduce(
    (picked, path) =>
      object[path] === undefined
        ? picked
        : Object.assign(picked, { [path]: object[path] }),
    {}
  )

module.exports = { pick }
