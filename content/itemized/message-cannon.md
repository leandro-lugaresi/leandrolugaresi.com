+++
type = "itemized"
author = "Leandro Lugaresi"
date = "2017-10-17"
title = "Message-cannon"
description = "Consume messages from message systems (RabbitMQ) and send to other applications"
format = "OpenSource"
linktitle = "Github"
link = "https://github.com/leandro-lugaresi/message-cannon"
+++

# message-cannon

Consume messages from message systems (RabbitMQ, NATS, Kafka) and send to other applications.


[![Release](https://img.shields.io/github/release/leandro-lugaresi/message-cannon.svg?style=flat-square)](https://github.com/leandro-lugaresi/message-cannon/releases/latest)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://travis-ci.org/leandro-lugaresi/message-cannon.svg?branch=master&style=flat-square)](https://travis-ci.org/leandro-lugaresi/message-cannon)
[![Coverage Status](https://img.shields.io/codecov/c/github/leandro-lugaresi/message-cannon/master.svg?style=flat-square)](https://codecov.io/gh/leandro-lugaresi/message-cannon)
[![Go Doc](https://img.shields.io/badge/godoc-reference-blue.svg?style=flat-square)](http://godoc.org/github.com/leandro-lugaresi/message-cannon)
[![Go Report Card](https://goreportcard.com/badge/github.com/leandro-lugaresi/message-cannon?style=flat-square)](https://goreportcard.com/report/github.com/leandro-lugaresi/message-cannon)
[![Say Thanks!](https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg)](https://saythanks.io/to/leandro-lugaresi)
[![Powered By: GoReleaser](https://img.shields.io/badge/powered%20by-goreleaser-green.svg?style=flat-square)](https://github.com/goreleaser)

---

# Motivation

If you already tried to use some long running code with PHP you probably notice some problems like:
- Doctrine connection closed;
- Entities outdated;
- A large amount of ram used by consumers sleeping;
- The process is dead but still running (supervisor think it's alive). 

message-cannon is a binary used to solve this problem we faced in PHP projects.
The idea is to run the consumers in a go binary and send the messages to callbacks using `runners`.