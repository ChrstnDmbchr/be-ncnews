exports.getUser = (req, res, next) => {
  res.status(200).send({
    message: `GET api/users/:username with username ${req.params.username} working`
  })
}