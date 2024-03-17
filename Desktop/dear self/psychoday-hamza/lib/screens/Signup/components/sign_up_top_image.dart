import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../utils/constants.dart';
import '../../../utils/style.dart';

class SignUpScreenTopImage extends StatelessWidget {
  const SignUpScreenTopImage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 40, 0, 0),
          child: Text(
            "Sign Up".toUpperCase(),
            style: TextStyle(fontWeight: FontWeight.bold,color: Style.primaryLight,fontFamily: 'Red Ring',fontSize: 25),
          ),
        ),
        SizedBox(height: defaultPadding ),
        Row(
          children: [
            const Spacer(),
            Expanded(
              flex: 8,
              child: Image.asset("Assets/images/signn.png"),
            ),
            const Spacer(),
          ],
        ),
        SizedBox(height: defaultPadding ),
      ],
    );
  }
}
