import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AuthContent } from '../../components/Auth/AuthContent';
import { AuthButton } from '../../components/Auth/AuthButton';
import { AuthError } from '../../components/Auth/AuthError';
import { InputWithLabel } from '../../components/Auth/InputWithLabel';
import { RightAlignedLink } from '../../components/Auth/RightAlignedLink';
import * as authActions from '../../store/modules/auth';
import * as userActions from '../../store/modules/user';
import queryString from 'query-string';

import storage from '../../lib/storage';

class LoginContainer extends Component {

    componentDidMount() {
        const { location } = this.props;
        const query = queryString.parse(location.search);

        if (query.expired !== undefined){
            this.setError('세션이 만료되었습니다. 다시 로그인하세요.');
        }
    }

    handleChange = (e) => {
        const { AuthActions } = this.props;
        const { name, value } = e.target;

        AuthActions.changeInput({
            name,
            value,
            form: 'login'
        });
    }

    componentWillUnmount() {
        const { AuthActions } = this.props;
        AuthActions.initializeForm('login')
    }

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'login',
            message
        });
        return false;
    }


    handleLocalLogin = async () => {
        const { form, AuthActions, UserActions, history } = this.props;
        const { email, password } = form.toJS();
       
        try {
            await AuthActions.localLogin({email, password});
            const loggedInfo = this.props.result.toJS();
            UserActions.setLoggedInfo(loggedInfo);
            history.push('/');
            await storage.set('loggedInfo', loggedInfo);

        } catch (e) {
            this.setError('잘못된 계정정보입니다.');
        }
    }

    render() {
        const { email, password } = this.props.form.toJS(); // form 에서 email 과 password 값을 읽어옴
        const { handleChange, handleLocalLogin } = this;
        const { error } = this.props;


        return (
            <AuthContent title="로그인">
                <InputWithLabel 
                    label="이메일" 
                    name="email" 
                    placeholder="이메일" 
                    value={email} 
                    onChange={handleChange}
                />
                <InputWithLabel 
                    label="비밀번호" 
                    name="password" 
                    placeholder="비밀번호" 
                    type="password" 
                    value={password} 
                    onChange={handleChange}
                />
                {
                    error && <AuthError>{error}</AuthError>
                }
                <AuthButton onClick={handleLocalLogin}>로그인</AuthButton>
                <RightAlignedLink to="/auth/register">회원가입</RightAlignedLink>
            </AuthContent>
        );
    }
}

export default connect(
    (state) => ({
        form: state.auth.getIn(['login', 'form']),
        error: state.auth.getIn(['login', 'error']),
        result: state.auth.get('result')
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(LoginContainer);