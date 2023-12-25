import aws from 'aws-sdk'
import multer from 'multer'
import uuidv4 from 'uuid/v4'
import multerS3 from 'multer-s3'

aws.config.update({
  secretAccessKey: 'p6vuU5SK03VqtLI0kdNh4o65uVQobf4sjZrHrKuh',
  accessKeyId: 'AKIA4GYANEY3DEYWDDSK',
  region: 'us-east-1'
})

const s3 = new aws.S3()
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'hype-ios-videos',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, uuidv4())
    }
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return cb(new Error('Invalid file type'))
    }

    return cb(null, true)
  }
})

export default async (req, res) => {
  upload.single('filepond')(req, {}, err => {
    if (err) {
      return res.status(421).send(err.message)
    }

    const { location } = req.file

    return res.status(200).json({ path: location })
  })
}

export const config = {
  api: {
    bodyParser: false
  }
}
