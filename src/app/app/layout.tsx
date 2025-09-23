import { withPlatformComponent } from '@/hoc/with-platform-component';
import AppLayout from './layout.web';
import ClientAppLayout from './layout.native';

export default withPlatformComponent(AppLayout, ClientAppLayout);
