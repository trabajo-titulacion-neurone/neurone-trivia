const express = require('express');
const router = express.Router();
const userAgent = require('useragent');
const SessionLog = require('../models/sessionLog');
const User = require('../models/user');
const GameElement = require('../models/gameElement');

const actionService = require('../services/neuronegm/action');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [verifyToken] , async (req, res) => {
    SessionLog.find({}, (err, sessionLogs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({sessionLogs});
    });
})

router.get('/:sessionLog_id', [verifyToken] , async (req, res) => {
    const _id = req.params.sessionLog_id;
    SessionLog.findOne({_id: _id}, (err, sessionLog) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({sessionLog});
    });
});

router.post('',  [verifyToken], async (req, res) => {
    const sessionLog = new SessionLog(req.body);
    /*UserAgent*/
    let userAgentString = (req.get('user-agent'));
    let userAgentObject = userAgent.parse(userAgentString);
    sessionLog.user_agent = userAgentString;
    sessionLog.browser = userAgentObject.toAgent();
    sessionLog.os = userAgentObject.os.toString();
    sessionLog.device = userAgentObject.device.toString();
    /*End UserAgent*/
    let lastLogin;
    let user;
    let loginAction;
    if(sessionLog.state === "login"){
        lastLogin = await SessionLog.findOne({state: "login", userId: req.body.userId}).sort({"createdAt": -1}).limit(1);
        user = await User.findById(req.body.userId);
        loginAction = await GameElement.findOne({key: 'inicio_sesion_1'});
    }
    await sessionLog.save((err, sessionLog) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if(loginAction && user && user.gm_code){
            let post =  {action_code: loginAction.gm_code, date: sessionLog.createdAt};
            if(!lastLogin){
                actionService.postPlayerAction(post, user.gm_code, (err, data) => {
                    if(err){
                        console.log(err);
                    }
                    res.status(200).json({
                        sessionLog
                    });
                });
            }
            else if(lastLogin && lastLogin.createdAt.getUTCDate() < sessionLog.createdAt.getUTCDate()){
                actionService.postPlayerAction(post, user.gm_code, (err, data) => {
                    if(err){
                        console.log(err);
                    }
                    res.status(200).json({
                        sessionLog
                    });
                });
            }
            else{
                res.status(200).json({
                    sessionLog
                });
            }
        }
        else{
            res.status(200).json({
                sessionLog
            });
        }
    })
});


router.delete('/:sessionLog_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
    const _id = req.params.sessionLog_id;
    SessionLog.deleteOne({_id: _id}, (err, sessionLog) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json({
            sessionLog
        });
    })
})


module.exports = router;