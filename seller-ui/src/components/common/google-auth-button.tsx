import { FieldSeparator } from '../ui/field'
import { Button } from '../ui/button'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const GoogleAuthButton = ({
    disabled,
    loading
}: {
    disabled?: boolean
    loading?: boolean
    className?: string
}
) => {
    return (
        <>
            <FieldSeparator className="my-2"> OR </FieldSeparator>

            <Link 
            to="/auth/google">
                <Button
                    disabled={disabled || loading}
                    variant="secondary"
                    type="button"
                    className="w-full cursor-pointer"
                >
                    Sign in with Google <IconBrandGoogleFilled />
                </Button>
            </Link>
        </>
    )
}

export default GoogleAuthButton