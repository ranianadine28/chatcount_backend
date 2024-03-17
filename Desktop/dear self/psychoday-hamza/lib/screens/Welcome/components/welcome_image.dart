import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:lottie/lottie.dart';
import 'package:psychoday/utils/style.dart';

import '../../../utils/constants.dart';

class WelcomeImage extends StatelessWidget {
  const WelcomeImage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          "shall we start ?".toUpperCase(),
          style: const TextStyle(fontWeight: FontWeight.bold,color: Style.whiteColor,fontFamily: 'Red Ring'),
        ),
        SizedBox(height: defaultPadding * 2),
        Row(
          children: [
            Spacer(),
            Expanded(
              flex: 8,
              child: Lottie.asset("Assets/animations/login.json", repeat: true,reverse: true,fit:BoxFit.cover),
              // SvgPicture.asset(
              //   "Assets/icons/chat.svg",
              // ),
            ),
            Spacer(),
          ],
        ),
        SizedBox(height: defaultPadding * 2),
      ],
    );
  }
}