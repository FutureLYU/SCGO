import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Codebox from "../../utils/CodeBox/CodeBox";
import Axios from "axios";
import { Form, Input, Button } from "antd";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function ChangePasswordPage(props) {
  const [VerifyCode, setVerifyCode] = useState("0000");
  const [VerifyId, setVerifyId] = useState("initialId");
  const [ifLoading, setifLoading] = useState(false);
  const [codeboxContent, setcodeboxContent] = useState(
    "Get Verification Code From Email"
  );
  return (
    <Formik
      initialValues={{
        email: "",
        verification: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
            verifyId: VerifyId,
            verifyCode: VerifyCode,
          };

          Axios.post("api/users/changepassword", dataToSubmit).then(
            (response) => {
              if (response.data.success) {
                props.history.push("/login");
              } else {
                alert(response.data.err.message);

                window.location.reload();
              }
            }
          );

          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        const codeGet = () => {
          setifLoading(true);
          setcodeboxContent("wait about 15 s");
          let variable = { email: values.email };
          Axios.post("/api/users/sendEmail", variable).then((response) => {
            if (response.data.success) {
              //console.log(response.data);
              setVerifyId(response.data.id);
              // button state
              setTimeout(() => {
                setifLoading(false);
                setcodeboxContent("send again");
              }, 15000);
            } else {
              //console.log(response.data.err);
              alert("Failed to send email");
              setifLoading(false);
              setcodeboxContent("Get Verification Code From Email");
            }
          });
        };

        return (
          <div className="app">
            <h2>Change Password</h2>
            <Form
              style={{ minWidth: "375px" }}
              {...formItemLayout}
              onSubmit={handleSubmit}
            >
              <Form.Item
                required
                label="Email"
                hasFeedback
                validateStatus={
                  errors.email && touched.email ? "error" : "success"
                }
              >
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item
                required
                label="Verification"
                style={{ marginBottom: "0 px" }}
              >
                <Form.Item>
                  <Codebox
                    id="verification"
                    type="text"
                    length={4}
                    validator={(input, index) => {
                      return /\d/.test(input);
                    }}
                    onChange={(codeArray) => {
                      setVerifyCode(codeArray.join(""));
                    }}
                  />
                  <Button
                    onClick={codeGet}
                    type="primary"
                    block={true}
                    loading={ifLoading}
                  >
                    {codeboxContent}
                  </Button>
                </Form.Item>
              </Form.Item>

              <Form.Item
                required
                label="New Password"
                hasFeedback
                validateStatus={
                  errors.password && touched.password ? "error" : "success"
                }
              >
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="Confirm" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  onClick={handleSubmit}
                  type="primary"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default ChangePasswordPage;
