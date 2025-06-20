-- v2 – replace the broken INSERT policy with a correct one
DROP POLICY IF EXISTS "Service role can insert profiles" ON user_profiles;

CREATE POLICY "Service role can insert profiles"
ON user_profiles
FOR INSERT
TO service_role                 -- the key we use in the API route
WITH CHECK (true);              -- allow every row the service role submits
