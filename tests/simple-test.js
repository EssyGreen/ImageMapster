/*
A dead simple javascript testing framework

V1.0 James Treworgy

This code is in the public domain
*/

function Test(options) {
    this.tests = [];
    this.title="Unit Tests for unnamed project";
    $.extend(this, options);
    if (!this.output) {
        this.output = $("div");
    }
    this._test_count= 0;
    this._fail_count = 0;
}
Test.prototype.addError = function (err,test) {
    this.output.append('<span>Failed test ' + this._test_count + ': ' + err + ' in test "' + test + '"</span><br>');
    this._fail_count++;
};
Test.prototype.startTest = function() {
    this._test_count++;
};
Test.prototype.endTest = function(err,description) {
    if (err) {
        this.addError(err,description);
    }
};
Test.prototype.addTest = function (name, test) {
    var testData = {
        name: name,
        test: test
    };
    this.tests.push(testData);
};
Test.prototype._arrayEq = function(arr1,arr2) {
    var err;
        if (!(arr1.length && (arr1.length>-1))) {
        err='Test case has no length property';
    }
    if (!(arr2.length && (arr2.length>-1))) {
        err='Expected value has no length property';
    }
    if (!err && arr1.length != arr2.length) {
        err='Arrays different length (test: ' + arr1.length + ', arr2expected: ' + expected.length;
    }
    if (!err) {
        for (var e=0;e<arr1.length;e++) {
            if (arr1[e]!==arr2[e]) {
                err="Arrays not equal starting at element " + count +".";
                break;
            }
        }
    }
    
    return err;

};
Test.prototype.assertEq = function (testCase, expected, description) {
    var err ;
    this.startTest();
    if (typeof testCase != typeof expected) {
        err = 'Test case type "' + typeof testCase + '" != expected type "' + typeof expected + '"';
    }
    
    if (!err && testCase != expected) {
        err = '"' + testCase + '" != "' + expected + '"';
    }
    this.endTest(err,description);
};
// test that object properties (shallow) match
Test.prototype.assertPropsEq = function(testcase,expected,description) {
        var me=this,err;
        function compare(t1,t2, t1name, t2name) {
        if (t1 && t1!==t2) {
            for (var prop in t2) {
                if (t2.hasOwnProperty(prop)) {
                    if (t1[prop]===undefined) {
                       err='Property ' + prop + ' in ' + t1name + ' does not exist in ' + t2name;
                       break;
                    }
                    if (t1 instanceof Array && t2 instanceof Array) {
                        err=me._arrayEq(t1,t2);
                        break;
                    }
                    if (typeof t1[prop]==='object' && typeof t2[prop]==='object') {
                        err=compare(t1[prop],t2[prop],t1name+'.'+prop,t2name+'.'+prop);
                        break;
                    }
                    if (t1[prop]!==t2[prop]) {
                       err='Property ' + prop + ' in ' + t1name + ' does not match same property in ' + t2name;
                       break;           
                    }
                }
            } 
        }
        return err;
    }
    var err;
    this.startTest();
    if (typeof testcase != 'object' || typeof expected != 'object') {
        err='Test cases are not both objects';
    }
    if (!err) {
        err=compare(testcase,expected,"test","expected");
    }
    if (!err) {
        err=compare(expected,testcase,"expected","testcase");
    }
    this.endTest(err,description);
};

Test.prototype.assertArrayEq = function(testcase, expected, description) {
    var err;
    this.startTest();

    err = this._arrayEq(testcase,expected);
    this.endTest(err,description);
};
Test.prototype.assertInstanceOf = function(testcase, expected, description) {
    var err,
        test = eval("testcase instanceof " + expected);
    this.startTest();
    if (!test) {
        err='testcase is not an instance of "' + expected+ '"';
    }
    if (err)  {
        this.addError(err,description);
    }  
};

// run all tests if no name provided
Test.prototype.run = function (test) {
    var i, started = false;
    function startTest(test) {
        if (!started) {
            this.output.append('<h1>"' + this.title + '"</h1><br /><hr /><br />');
        }
        this._test_count = 0;
        this._fail_count = 0;
        this.output.append('<h2>Test Group "' + test.name + '"</h2><br />==============================<br />');
    }
    function finishTest() {
        var result = "Completed " + this._test_count + " tests. ";
        if (this._fail_count > 0) {
            result += " " + this._test_count - this._fail_count + " passed, " + this._fail_count + " failed.";
        } else {
            result += " PASSED.";
        }
        this.output.append(result + "<br />");
        this.output.append('==============================<br />');
    }
    for (i = 0; i < this.tests.length; i++) {
        if (!test || this.tests[i].name == test) {
            startTest.call(this, this.tests[i]);
            this.tests[i].test(this);
            finishTest.call(this);
        }
    }

    this.output.append('<hr /');

};
