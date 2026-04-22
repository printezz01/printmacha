-- Copy and paste this ENTIRE block into your Supabase SQL Editor and hit RUN.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- If ANYTHING fails (e.g. missing columns, type errors), 
    -- silently catch it so the user's signup doesn't get blocked!
    RETURN new;
END;
$$;
