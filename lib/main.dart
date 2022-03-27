// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';

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
                        color: Colors.amber[400], 
                    )
                )
            )
        )
    )
);