/* import { useActionState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router";



function LoginForm(props) {
    const [state, formAction] = useActionState(submitCredentials, { email: '', password: '' })

    async function submitCredentials(prevData, formData) {
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        try {
            await props.handleLogin(credentials);
            return { success: true }
        }
        catch (error) {
            return { error: 'Invalid credentials' };
        }
    }

    return <Container fluid>
        <Form action={formAction}>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' name="email" required />
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' name='password' required></Form.Control>
            </Form.Group>

            {state.error && <p className="text-danger">{state.error}</p>}

            <Link className="btn btn-secondary" to={'/'}>Cancel</Link>
            <Button type='submit'>Login</Button>
        </Form>


    </Container>
}

export default LoginForm; */


import { useActionState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router";

function LoginForm(props) {
  const [state, formAction] = useActionState(submitCredentials, { email: '', password: '' });

  async function submitCredentials(prevData, formData) {
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };
    try {
      await props.handleLogin(credentials);
      return { success: true };
    } catch (error) {
      return { error: 'Invalid credentials' };
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: "linear-gradient(135deg, #4a90e2 0%, #6fb1fc 100%)",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card 
        className="shadow login-card text-center"
        style={{ 
          width: '380px',
          padding: '25px',
          borderRadius: '15px',
          backgroundColor: '#f8f9fa', // light card background
          border: 'none'  // remove default border, shadow is enough
        }}
      >
        <Card.Body>
          <Card.Title 
            className="mb-4"
            style={{ fontWeight: '700', fontSize: '1.6rem', color: '#0d6efd' }}
          >
            Login
          </Card.Title>

          <Form action={formAction}>
            <Form.Group controlId="email" className="mb-3 text-start">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type='email' 
                name="email" 
                placeholder="Enter your email"
                required 
              />
            </Form.Group>

            <Form.Group controlId='password' className="mb-3 text-start">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type='password' 
                name='password' 
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            {state.error && <p className="text-danger text-center">{state.error}</p>}

            <div className="d-flex justify-content-between mt-4">
              <Link className="btn btn-outline-secondary" to={'/'}>Cancel</Link>
              <Button type='submit' variant="primary">Login</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginForm;


 


