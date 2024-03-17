import 'package:flutter/material.dart';
import 'package:psychoday/utils/style.dart';

import '../../../utils/constants.dart';
import '../../Login/login_screen.dart';
import '../../Signup/signup_screen.dart';

class LoginAndSignupBtn extends StatelessWidget {
  const LoginAndSignupBtn({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Hero(
          tag: "login_btn",
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return LoginScreen();
                  },
                ),
              );
            },

            style: ElevatedButton.styleFrom(
              primary: Style.whiteColor, elevation: 0),
            child: const Text(
              "Login",
              style: TextStyle(color: Style.primaryLight,fontFamily: 'Mark-Light', fontWeight: FontWeight.bold , fontSize: 17),
            ),
          ),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) {
                  return SignUpScreen();
                },
              ),
            );
          },
          style: ElevatedButton.styleFrom(
              primary: Style.primary, elevation: 0),
          child:const Text(
            "sign up",
            style: TextStyle(color: Style.whiteColor,fontFamily: 'Mark-Light', fontWeight: FontWeight.bold , fontSize: 17),
          ),
        ),
      ],
    );
  }
}
