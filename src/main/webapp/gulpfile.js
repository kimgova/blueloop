/*!
 * gulp
 * $ npm install gulp-concat gulp-strip-debug gulp-uglify gulp-gzip gulp-qunit gulp-exec --save-dev
 */

//Dependencies
var gulp 		= require('gulp'),
    concat 		= require('gulp-concat'),
    stripDebug 	= require('gulp-strip-debug'),
    uglify 		= require('gulp-uglify'),
    gzip 		= require('gulp-gzip'),
    qunit 		= require('gulp-qunit'),
    exec        = require('gulp-exec'),
    del         = require('del');

// Clean
gulp.task('clean', function() {
    del(['js/loop/forecast/build'])
});

//Build JS Files
gulp.task('compress-forecast', ['clean'], function () {
    return gulp.src([
            'js/buildingBlock/imageChooser/model/imageModel.js',
            'js/buildingBlock/imageChooser/model/categoryModel.js',
            'js/buildingBlock/imageChooser/model/imageCollection.js',
            'js/buildingBlock/imageChooser/model/categoryCollection.js',
            'js/buildingBlock/imageChooser/view/imageView.js',
            'js/buildingBlock/imageChooser/view/categoryView.js',
            'js/buildingBlock/imageChooser/view/imageModalView.js',
            'js/loop/forecast/fcstInst/main/fcstInstModel.js',
            'js/loop/forecast/fcstInst/main/fcstInstCollection.js',
            'js/loop/forecast/fcstInst/main/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstAct/fcstInstActModel.js',
            'js/loop/forecast/fcstInst/fcstInstAct/fcstInstActCollection.js',
            'js/loop/forecast/fcstInst/fcstInstAct/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstEdit/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstEditCat/fcstCatModel.js',
            'js/loop/forecast/fcstInst/fcstInstEditCat/fcstCatCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditCat/fcstSubModel.js',
            'js/loop/forecast/fcstInst/fcstInstEditCat/fcstSubCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditCat/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstEditEquiv/fcstHeaderEquivModel.js',
            'js/loop/forecast/fcstInst/fcstInstEditEquiv/fcstHeaderEquivCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditEquiv/fcstSKUEquivModel.js',
            'js/loop/forecast/fcstInst/fcstInstEditEquiv/fcstSKUEquivCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditEquiv/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleModel.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleCollection.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleUserModel.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleUserCollection.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleFilterModel.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleFilterCollection.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleSkuFilterModel.js',
            'js/loop/forecast/fcstInst/fcstInstRole/model/fcstRoleSkuFilterCollection.js',
            'js/loop/forecast/fcstInst/fcstInstRole/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstRole/view/filters/*.js',
            'js/loop/forecast/fcstInst/fcstInstRole/view/roles/*.js',
            'js/loop/forecast/fcstInst/fcstInstRole/view/userlist/*.js',
            'js/loop/forecast/fcstInst/fcstInstEdit3S/fcstInst3SModel.js',
            'js/loop/forecast/fcstInst/fcstInstEdit3S/fcstInst3SCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEdit3S/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/main/fcstLinearModel.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/main/fcstLinearCollection.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/main/fcstLinearRoleModel.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/main/fcstLinearRoleCollection.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/main/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/fcstLinearVarModel.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/fcstLinearVarCollection.js',
            'js/loop/forecast/fcstInst/fcstInstLinear/fcstInstLinearVar/view/*.js',
            'js/loop/forecast/fcstInst/fcstCollabAdj/fcstCollabAdjModel.js',
            'js/loop/forecast/fcstInst/fcstCollabAdj/fcstCollabAdjCollection.js',
            'js/loop/forecast/fcstInst/fcstCollabAdj/view/*.js',
            'js/loop/forecast/fcstInst/fcstCollabRisk/fcstCollabRiskModel.js',
            'js/loop/forecast/fcstInst/fcstCollabRisk/fcstCollabRiskCollection.js',
            'js/loop/forecast/fcstInst/fcstCollabRisk/view/*.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabEquivModel.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabEquivCollection.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabRowModel.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabDataModel.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabDataCollection.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabFilterModel.js',
            'js/loop/forecast/fcstInst/fcstCollab/fcstCollabFilterCollection.js',
            'js/loop/forecast/fcstInst/fcstCollab/view/*.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/model/fcstInstSkuModel.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/model/fcstInstSkuCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/model/fcstInstSkuAssoCollection.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/view/skuNewAdd/*.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/view/skuNewAsso/*.js',
            'js/loop/forecast/fcstInst/fcstInstEditSku/view/skuNewTab/*.js',
            'js/loop/forecast/fcstInst/fcstInstBudget/fcstInstBudgetModel.js',
            'js/loop/forecast/fcstInst/fcstInstBudget/fcstInstBudgetCollection.js',
            'js/loop/forecast/fcstInst/fcstInstBudget/view/*.js',
            'js/loop/forecast/fcstChain/fcstWUAct/fcstWUActModel.js',
            'js/loop/forecast/fcstChain/fcstWUAct/fcstWUActCollection.js',
            'js/loop/forecast/fcstChain/fcstWUAct/view/*.js',
            'js/loop/forecast/fcstChain/fcstWUMember/fcstWUMemberModel.js',
            'js/loop/forecast/fcstChain/fcstWUMember/fcstWUMemberCollection.js',
            'js/loop/forecast/fcstChain/fcstWUMember/view/*.js',
            'js/loop/forecast/fcstChain/fcstWU/fcstWUModel.js',
            'js/loop/forecast/fcstChain/fcstWU/fcstWUCollection.js',
            'js/loop/forecast/fcstChain/fcstWU/view/*.js',
            'js/loop/forecast/fcstChain/fcstBudget/fcstBudgetModel.js',
            'js/loop/forecast/fcstChain/fcstBudget/fcstBudgetCollection.js',
            'js/loop/forecast/fcstChain/fcstBudget/view/*.js',
            'js/loop/forecast/fcstChain/main/fcstModel.js',
            'js/loop/forecast/fcstChain/main/fcstCollection.js',
            'js/loop/forecast/fcstChain/main/view/*.js',
            'js/loop/forecast/fcstChain/fcstLeader/fcstLeaderModel.js',
            'js/loop/forecast/fcstChain/fcstLeader/fcstLeaderCollection.js',
            'js/loop/forecast/fcstChain/fcstLeader/view/*.js',
            'js/loop/forecast/fcstChain/fcstModel/fcstModelModel.js',
            'js/loop/forecast/fcstChain/fcstModel/fcstModelCollection.js',
            'js/loop/forecast/fcstChain/fcstModel/view/*.js',
            'js/modalDialogs/*.js',
            'js/loop/forecast/forecastConfigs.js',
            'js/loop/forecast/forecastModuleView.js',
            'js/loop/forecast/forecastModuleRouter.js'])
  .pipe(concat('forecast.js'))
  .pipe(stripDebug())
  .pipe(uglify())
  .pipe(gulp.dest('js/loop/forecast/build'))
});

//Testing
gulp.task('test', ['compress-forecast'], function() {
    return gulp.src('js_test/loop/execution/test-runner.html')
        .pipe(qunit());
});

gulp.task('build', ['create-grails-war']);

gulp.task('create-grails-war', ['test'], function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    customTemplatingThing: "test" // content passed to gutil.template()
  };
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }
  gulp.src('./**/**')
    .pipe(exec('grails -version', options))
    .pipe(exec.reporter(reportOptions));
});