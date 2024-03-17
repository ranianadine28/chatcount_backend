import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../components/already_have_an_account_acheck.dart';
import '../../../utils/constants.dart';
import '../../Login/login_screen.dart';
import 'package:http/http.dart' as http;

class SignUpForm extends StatefulWidget {
  const SignUpForm({
    Key? key,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignUpForm> {
  late String _fullname;
  late String _nickname;

  late String _email;
  late String _password;
  final GlobalKey<FormState> _keyForm = GlobalKey<FormState>();

  //actions
  void signupAction() {
    //url
    Uri addUri = Uri.parse("$BASE_URL/user/signup");

    //data to send
    Map<String, dynamic> userObject = {
      "fullName": _fullname,
      "nickName": _nickname,
      "email": _email,
      "password": _password
    };

    //data to send
    Map<String, String> headers = {
      "Content-Type": "application/json",
    };

    //request
    http
        .post(addUri, headers: headers, body: json.encode(userObject))
        .then((response) {
      if (response.statusCode == 201) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) {
              return LoginScreen();
            },
          ),
        );
      } else if (response.statusCode == 401) {
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text("Information"),
              content: const Text("Username et/ou mot de passe incorrect!"),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Dismiss"))
              ],
            );
          },
        );
      } else {
        showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text("Information"),
              content: const Text("Server error! Try again later"),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Dismiss"))
              ],
            );
          },
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _keyForm,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryColor,
              onSaved: (String? value) {
                _fullname = value!;
              },
              validator: (String? value) {
                if (value == null || value.isEmpty) {
                  return "Le username ne doit pas etre vide";
                } else if (value.length < 5) {
                  return "Le username doit avoir au moins 5 caractères";
                } else {
                  return null;
                }
              },
              decoration: InputDecoration(
                hintText: "Your fullname",
                prefixIcon: Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.person),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryColor,
              onSaved: (String? value) {
                _email = value!;
              },
              validator: (String? value) {
                if (value == null || value.isEmpty) {
                  return "L'email' ne doit pas etre vide";
                } else {
                  return null;
                }
              },
              decoration: InputDecoration(
                hintText: "Your email",
                prefixIcon: Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.mail),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.next,
              cursorColor: kPrimaryColor,
              onSaved: (String? value) {
                _nickname = value!;
              },
              validator: (String? value) {
                if (value == null || value.isEmpty) {
                  return "Le nickname' ne doit pas etre vide";
                } else if (value.length < 5) {
                  return "Le nickname doit avoir au moins 5 caractères";
                } else {
                  return null;
                }
              },
              decoration: InputDecoration(
                hintText: "Your nickName",
                prefixIcon: Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.person),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.phone,
              cursorColor: kPrimaryColor,
              onSaved: (String? value) {
                _nickname = value!;
              },
              validator: (String? value) {
                if (value == null || value.isEmpty) {
                  return "Le numero' ne doit pas etre vide";
                } else {
                  return null;
                }
              },
              decoration: InputDecoration(
                hintText: "Your phone",
                prefixIcon: Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.phone),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.done,
              keyboardType: TextInputType.visiblePassword,
              obscureText: true,
              cursorColor: kPrimaryColor,
              onSaved: (String? value) {
                _password = value!;
              },
              validator: (String? value) {
                if (value == null || value.isEmpty) {
                  return "Le mot de passe ne doit pas etre vide";
                } else if (value.length < 5) {
                  return "Le mot de passe doit avoir au moins 5 caractères";
                } else {
                  return null;
                }
              },
              decoration: InputDecoration(
                hintText: "Your password",
                prefixIcon: Padding(
                  padding: const EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding / 2),
          ElevatedButton(
            onPressed: () {
              if (_keyForm.currentState!.validate()) {
                _keyForm.currentState!.save();
                signupAction();
              }
            },
            child: Text(
              "Sign Up".toUpperCase(),
              style: TextStyle(
                  fontFamily: 'Mark-Light',
                  fontWeight: FontWeight.bold,
                  fontSize: 17),
            ),
          ),
          const SizedBox(height: defaultPadding),
          AlreadyHaveAnAccountCheck(
            login: false,
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return LoginScreen();
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
