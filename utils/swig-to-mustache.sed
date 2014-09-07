#!/bin/sed -f
#
# Convert Swig comments to Mustache comments.
#

# Comment opening
s/^\( *\){##*/\1{{!/g

# Comment closing
s/#}$/}}/g

# Block comment doc continue
s/^\( *\)#/\1!/
