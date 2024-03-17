import 'package:flutter/material.dart';
import 'package:psychoday/utils/constants.dart';
import 'package:psychoday/utils/style.dart';

class AlreadyHaveAnAccountCheck extends StatelessWidget {
  final bool login;
  final Function? press;
  const AlreadyHaveAnAccountCheck({
    Key? key,
    this.login = true,
    required this.press,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(
          login ? "Don’t have an Account ? " : "Already have an Account ? ",
          style: const TextStyle(color: Style.primaryLight,fontFamily: 'Mark-Light'),
        ),
        GestureDetector(
          onTap: press as void Function()?,
          child: Text(
            login ? "sign up" : "sign in",
            style: const TextStyle(color: Style.primary,fontFamily: 'Mark-Light', fontWeight: FontWeight.bold ),
          ),
        )
      ],
    );
  }
}
