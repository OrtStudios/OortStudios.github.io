// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';

import 'package:oort_studios_website/colors.dart';

void main() => runApp(
    MaterialApp(
        home: Scaffold(
            backgroundColor: Color.fromARGB(255, 0, 50, 92),
            body: Center(
                child: Text(
                    'Under Constructions',
                    style: TextStyle(
                        fontSize: 150,
                        fontWeight: FontWeight.bold,
                        color: AMBER400
                    )
                )
            )
        )
    )
);