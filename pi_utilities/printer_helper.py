#!/usr/bin/python

from __future__ import print_function
from p_thermal.Adafruit_Thermal import *
from unidecode import unidecode
import HTMLParser


printer = Adafruit_Thermal("/dev/ttyAMA0", 19200, timeout=5)
printer.upsideDownOn()
# printer.printMode = 46  # font size, slightly bolder font
# printer.writePrintMode()


def rprint(msg, screen_name='test'):
    # print('msg: {}'.format(msg.encode('ascii', 'ignore')))
    # printer.inverseOn()
    # printer.print(' ' + '{:<31}'.format(screen_name))
    # printer.inverseOff()

    # printer.underlineOn()
    # printer.print('{:<32}'.format(tweet['created_at']))
    # printer.underlineOff()

    # Remove HTML escape sequences
    # and remap Unicode values to nearest ASCII equivalents
    text = unidecode(HTMLParser.HTMLParser().unescape(msg))
    r_text = printer.textWrapped(text)

    printer.print(r_text)

    printer.feed(3)


if __name__ == '__main__':
    rprint('cat')
    rprint('test test')
