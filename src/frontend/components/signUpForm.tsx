import { CloseIcon } from './icons/CloseIcon'
import Link from 'next/link'
import { useEffect, useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { withRouter } from 'next/router'



 const SignUpForm = (props:any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  useEffect(() => {
}, [props.router.query]);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmedPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const signUp = (email:string, password:string) =>{
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
  
    fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode) {
          console.log('error')
        } else {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          router.push('/');
        }
      })
      .catch((error) => alert(`Sign Up Error: ${error}`));

  }
  const router = useRouter();
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      email: props.router.query.email,
      password: '',
      confirmedPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address')
      .required('E-mail is Required'),
      password: Yup.string()
        .required('Password is Required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
      confirmedPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Password doesn\'t match !'
      )}),
    onSubmit: values => {
      const { email, password } = values;
      signUp(email as string, password as string)
     
    }});

return (
  <div className='px-2'>
      <div className='header-form flex justify-between m-2 mb-5 items-center'>
        <ArrowBackIcon className="h-6 w-6 fill-current text-black" onClick={() => router.back()}/>
       <span className='font-bold text-lg'>Sign Up</span>
          <div onClick={() => router.push('/')}>
            <CloseIcon className="h-6 w-6 fill-current text-black" />
          </div>
      </div>
    <form className='mx-2 mt-2' onSubmit={formik.handleSubmit}>
      <div className='form-group'>
        <div className="group-form">
        <TextField
        className='focus-within:border-green-600  w-full' 
        label="Your Email"
        variant="outlined"
        size='small'
        id="email"
        name="email"
        type="email"
        color={formik.errors.email ? 'error' : 'primary'}
        InputLabelProps={{
          style: { fontSize: '15px' }
        }}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
         />
        {formik.touched.email && formik.errors.email ? (
         <div className='text-sm my-2'  style={{color:theme.palette.error.main}}>{formik.errors.email}</div>
       ) : null}
        </div>
        <div className="group-form mt-2">
        <TextField
      className='focus-within:border-green-600 mt-2 w-full' 
      label="Password"
      color={formik.errors.password ? 'error' : 'primary'}
      variant="outlined"
      size='small'
      type={showPassword ? 'text' : 'password'}
      id='password'
      name='password'
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.password}
      InputLabelProps={{
        style: { fontSize: '15px' }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff fontSize="small"  /> : <Visibility fontSize="small"/>}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
             {formik.touched.password && formik.errors.password ? (
         <div className='text-sm my-2  ' style={{color:theme.palette.error.main}}>{formik.errors.password}</div>
       ) : null}
        </div>
        <div className="group-form mt-2">
        <TextField
      className='focus-within:border-green-600 mt-2 w-full' 
      label="Confirm Password"
      variant="outlined"
      size='small'
      color={formik.errors.password ? 'error' : 'primary'}
      type={showConfirmedPassword ? 'text' : 'password'}
      id='confirmedPassword'
      name='confirmedPassword'
      InputLabelProps={{
        style: { fontSize: '15px' }
      }}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
       value={formik.values.confirmedPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowConfirmedPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showConfirmedPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
           {formik.touched.confirmedPassword && formik.errors.confirmedPassword ? (
         <div className='text-sm my-2' style={{color:theme.palette.error.main}}>{formik.errors.confirmedPassword}</div>
       ) : null}
        </div>
      </div>
      <button className='w-full rounded-lg p-2 mt-3 text-white'style={{ backgroundColor: '#42A87A' }}>Continue</button>
    </form>
    <p className='text-sm mt-2 ml-2'>Already have an account? <span className='font-bold underline'><Link href="/LoginForm">Login</Link></span></p>
  </div>
)
}

export default withRouter(SignUpForm)