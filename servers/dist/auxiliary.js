"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringToBytes = stringToBytes;
// set of auxiliary functions that don't belong to any existing class/module

function stringToBytes(s) {
    var b = [];
    for (var i = 0; i < s.length; i++) {
        b.push(s.charCodeAt(i));
    }return b;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXhpbGlhcnkuanMiXSwibmFtZXMiOlsic3RyaW5nVG9CeXRlcyIsInMiLCJiIiwiaSIsImxlbmd0aCIsInB1c2giLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7OztRQUVnQkEsYSxHQUFBQSxhO0FBRmhCOztBQUVPLFNBQVNBLGFBQVQsQ0FBdUJDLENBQXZCLEVBQTBCO0FBQzdCLFFBQUlDLElBQUksRUFBUjtBQUNBLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixFQUFFRyxNQUF0QixFQUE4QkQsR0FBOUI7QUFDSUQsVUFBRUcsSUFBRixDQUFPSixFQUFFSyxVQUFGLENBQWFILENBQWIsQ0FBUDtBQURKLEtBRUEsT0FBT0QsQ0FBUDtBQUNIIiwiZmlsZSI6ImF1eGlsaWFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHNldCBvZiBhdXhpbGlhcnkgZnVuY3Rpb25zIHRoYXQgZG9uJ3QgYmVsb25nIHRvIGFueSBleGlzdGluZyBjbGFzcy9tb2R1bGVcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdUb0J5dGVzKHMpIHtcclxuICAgIGxldCBiID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYi5wdXNoKHMuY2hhckNvZGVBdChpKSk7XHJcbiAgICByZXR1cm4gYjtcclxufSJdfQ==