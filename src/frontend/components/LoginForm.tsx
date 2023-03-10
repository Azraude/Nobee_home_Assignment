import { CloseIcon } from './icons/CloseIcon'
import { FormEventHandler, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// test@gmail.com 
// pUJs5J96u9w& 


export const LoginForm = () => {
  const [emailExists,setEmailExists] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  useEffect(() => {
    return () => {
      setIsSubmitting(false)
    }
  }, [])
  const checkEmailExists = async () => {
    const response = await fetch(`/api/auth/emails/${formik.values.email}`, {method: 'HEAD'})
    setEmailExists(response.ok)
    if(!response.ok){
      router.push({pathname: '/signUpForm', query:{email:formik.values.email}},'/signUpForm')
    }
    setIsSubmitting(false)
  }

  const handleSubmit:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    checkEmailExists()
    formik.submitForm();
  }
  const logIn = (email: string, password: string) => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode) {
          alert('error in Login')
        } else {
          localStorage.setItem('accessToken', result.accessToken)
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          router.push('/')
        }
      })
      .catch((error) => alert(error))
  }
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmedPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address')
      .required('E-mail is Required'),
      password: Yup.string()
        .required('Password is Required')
      }),
    onSubmit: values => {
      const { email, password } = values;
      logIn(email as string, password as string)
     
    }});
return (
  <div className='px-2'>
     {emailExists?
       <div className='header-form flex justify-between m-2 mb-5 items-center'>
        <ArrowBackIcon className="h-6 w-6 fill-current text-black" onClick={() => router.back()}/>
       <span className='font-bold text-lg'>Login</span>
          <div onClick={() => router.push('/')}>
            <CloseIcon className="h-6 w-6 fill-current text-black" />
          </div>
       </div>
       :  
       <div className='header-form flex justify-between m-2 mb-5 items-center'>
       <span className='font-bold text-lg'>Sign Up or Login</span>
       <div onClick={() => router.push('/')}>
            <CloseIcon className="h-6 w-6 fill-current text-black" />
          </div>
       </div>}
   
    <form className='mx-2 mt-2'onSubmit={handleSubmit}>
      <div className='form-group '>
      <div className="group-form">
      <TextField
        className='focus-within:border-blue-600  w-full'
        label="Your Email"
        variant="outlined"
        color={formik.errors.email ? 'error' : 'primary'}
        id="email"
        name="email"
        size="small"
        InputLabelProps={{
          style: { fontSize: '15px' }
        }}
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
         />
        {formik.touched.email && formik.errors.email ? (
         <div className='text-sm my-2'  style={{color:theme.palette.error.main}}>{formik.errors.email}</div>
       ) : null}
        </div>
      </div>
      {emailExists?
        <div className="group-form mt-2">
         <TextField
      className='focus-within:border-green-600 mt-2 w-full' 
      label="Password"
      variant="outlined"
      size='small'
      color={formik.errors.password ? 'error' : 'primary'}
      type={showPassword ? 'text' : 'password'}
      id='password'
      name='password'
      InputLabelProps={{
        style: { fontSize: '15px' }
      }}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.password}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
           {formik.touched.password && formik.errors.password ? (
       <div className='text-sm my-2  ' style={{color:theme.palette.error.main}}>{formik.errors.password}</div>
     ) : null}
      </div>
       : null}
      <button className='w-full rounded-lg p-2 mt-3 text-white'style={{ backgroundColor: '#42A87A' }} disabled={isSubmitting}>Continue</button>
    </form>
    {emailExists?
        <span className='font-bold underline text-sm ml-2 mt-5'><Link href="/signUpForm">Sign Up</Link></span>
       : null}
  

  </div>
)
}

