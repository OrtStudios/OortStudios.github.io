// ignore_for_file: library_prefixes, use_key_in_widget_constructors

import 'package:flutter/material.dart';

import 'package:oort_studios_website/global.dart' as Global;

void GoToHome(BuildContext context)
{
    if (Global.CurrentRoute != '/')
    {
        Global.CurrentRoute = '/home';
        Global.NamedCurrentRoute = 'Home';
        Navigator.pushNamedAndRemoveUntil(context, '/home', (_) => false);
    }
}

class MenuBar extends AppBar
{
    MenuBar(BuildContext context) : super(
        automaticallyImplyLeading: false,
        toolbarHeight: 80,
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
                FlatButton(
                    child: Image.asset(
                        'assets/images/Logo-1080.png',
                        fit: BoxFit.contain,
                        height: 80
                    ),
                    onPressed: () => GoToHome(context)
                )
            ]
        )
    );
}