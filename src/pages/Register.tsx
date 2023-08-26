import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../services/Auth/Auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  query,
  setDoc,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { Button, Form } from "react-bootstrap";
import { storeUserData } from "../services/storage/Storage";
import { useDispatch, useSelector } from "react-redux"; // Update the import path for `createUserWithEmailAndPassword` and `auth`
import { login, selectAuthTokenData } from "../store/AuthSlice"; // Make sure to import the correct action from your auth slice

import { RootState, useAppDispatch } from "../store/Store"; // Update the import path for your RootState type

interface Errors {
  email: { required: boolean };
  password: { required: boolean };
  name: { required: boolean };
  custom_error: string | null;
  custom_error_status: boolean;
}

const initialStateErrors: Errors = {
  email: { required: false },
  password: { required: false },
  name: { required: false },
  custom_error: null,
  custom_error_status: false,
};

const Register = () => {
  const authlogin = useSelector((state: RootState) => state.auth.authToken);
  const dispatch = useAppDispatch();
  const notesReduxData = useSelector(selectAuthTokenData);
  console.log("authlogin", authlogin);
  console.log("notesReduxData", notesReduxData);

  console.log(notesReduxData);
  const nav = useNavigate();
  useEffect(() => {
    if (authlogin) {
      nav("/");
      console.log("login eeee");
    }
  }, [authlogin]);

  // const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors>(initialStateErrors);

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const handleError = (): void => {
    let errors: Errors = initialStateErrors;
    let hasError = false;
    if (inputs.name === "") {
      errors.name.required = true;
      hasError = true;
    }
    if (
      inputs.email === "" ||
      !inputs.email.includes("@") ||
      !inputs.email.includes(".")
    ) {
      errors.email.required = true;
      hasError = true;
    }

    if (inputs.password === "" || inputs.password.length < 6) {
      errors.password.required = true;
      hasError = true;
    }
    console.log(hasError);
    console.log(inputs);
    if (!hasError) {
      setLoading(true);
      // sending register api request
      createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
        .then((res) => {
          console.log(res.user.uid);
          storeUserData(res.user.uid); // Implement your storeUserData function

          dispatch(login());
        })
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            setErrors({
              ...errors,
              custom_error: "Account Already Exists",
              custom_error_status: true,
            });
          }
          if (err.code === "auth/invalid-email") {
            setErrors({
              ...errors,
              custom_error: "Invalid Email Address",
              custom_error_status: true,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(initialStateErrors, errors);
    setErrors(errors);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleError();
  };
  return (
    <>
      <div className="signup-wrapper">
        <div id="signup">
          <section className="form signup ">
            <header>Notes App</header>
            <Form onSubmit={handleSubmit} className="form-inside">
              {errors.custom_error && (
                <div className="error-text">{errors.custom_error}</div>
              )}

              <Form.Group className="mb-3" controlId="displayname">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className="shadow-none"
                  type="text"
                  name="name"
                  placeholder="Enter Username"
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  className="shadow-none"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  required
                  className="shadow-none"
                  onChange={handleChange}
                />
                {/* <div className="eye-btn" onClick={handleEyebtn}>
                  <i
                    className={`fa-regular ${
                      eyebtn ? "fa-eye" : "fa-eye-slash"
                    }`}
                  ></i>
                </div> */}
              </Form.Group>

              {/* <Form.Group className="mb-3" controlId="image">
              <Form.Label>Select Avatar</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/x-png,image/gif,image/jpeg,image/jpg"
                required
              />
            </Form.Group> */}

              <Button
                className="mb-3 submit-btn"
                variant="primary"
                type="submit"
                name="submit"
                disabled={loading}
              >
                {loading ? "Loading please wait..." : "Continue"}
              </Button>
            </Form>
            <div className="link">
              Already signed up? <Link to="/login">Login now</Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Register;
